import express from 'express';
import { dataStore } from '../db/dataStore.js';

const router = express.Router();

// Helper middleware to extract user context
const getUserFromHeader = (req) => {
  const userId = req.headers['x-user-id'] || 'usr-1';
  return dataStore.getUserById(userId);
};

// --- Auth Routes ---
router.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email dan password wajib diisi." });
  }

  const user = dataStore.login(email, password);
  if (!user) {
    return res.status(401).json({ success: false, message: "Email atau password tidak sesuai." });
  }

  return res.json({
    success: true,
    message: `Selamat datang kembali, ${user.name}!`,
    data: { user, token: `token-${user.id}` }
  });
});

router.get('/auth/me', (req, res) => {
  const user = getUserFromHeader(req);
  if (!user) {
    return res.status(401).json({ success: false, message: "Sesi tidak ditemukan." });
  }
  return res.json({ success: true, data: { user } });
});

router.post('/auth/logout', (req, res) => {
  return res.json({ success: true, message: "Berhasil keluar dari sistem." });
});

// --- Training Routes ---
router.get('/trainings', (req, res) => {
  const user = getUserFromHeader(req);
  const { category, level, search, includeArchived } = req.query;

  const trainings = dataStore.getAllTrainings(user ? user.id : null, {
    category,
    level,
    search,
    includeArchived: includeArchived === 'true'
  });

  return res.json({ success: true, data: trainings });
});

router.get('/trainings/:id', (req, res) => {
  const user = getUserFromHeader(req);
  const training = dataStore.getTrainingDetail(req.params.id, user ? user.id : null);
  if (!training) {
    return res.status(404).json({ success: false, message: "Pelatihan tidak ditemukan." });
  }
  return res.json({ success: true, data: training });
});

router.post('/trainings', (req, res) => {
  const user = getUserFromHeader(req);
  if (user && user.role !== 'admin') {
    return res.status(403).json({ success: false, message: "Akses ditolak. Fitur khusus Trainer/Admin." });
  }

  const newTraining = dataStore.createTraining(req.body);
  return res.status(201).json({
    success: true,
    message: "Pelatihan baru berhasil dibuat!",
    data: newTraining
  });
});

router.put('/trainings/:id', (req, res) => {
  const user = getUserFromHeader(req);
  if (user && user.role !== 'admin') {
    return res.status(403).json({ success: false, message: "Akses ditolak. Fitur khusus Trainer/Admin." });
  }

  const updated = dataStore.updateTraining(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: "Pelatihan tidak ditemukan." });
  }
  return res.json({ success: true, message: "Data pelatihan berhasil diperbarui.", data: updated });
});

router.delete('/trainings/:id', (req, res) => {
  const user = getUserFromHeader(req);
  if (user && user.role !== 'admin') {
    return res.status(403).json({ success: false, message: "Akses ditolak. Fitur khusus Trainer/Admin." });
  }

  const success = dataStore.deleteTraining(req.params.id);
  if (!success) {
    return res.status(404).json({ success: false, message: "Pelatihan tidak ditemukan." });
  }
  return res.json({ success: true, message: "Pelatihan berhasil diarsipkan." });
});

// --- Enrollment Routes ---
router.post('/trainings/:id/enroll', (req, res) => {
  const user = getUserFromHeader(req);
  if (!user) {
    return res.status(401).json({ success: false, message: "Silakan login terlebih dahulu." });
  }

  const result = dataStore.enrollUser(user.id, req.params.id);
  if (!result.success) {
    return res.status(400).json(result);
  }

  return res.json({
    success: true,
    message: result.message,
    data: result.enrollment
  });
});

router.delete('/trainings/:id/enroll', (req, res) => {
  const user = getUserFromHeader(req);
  if (!user) {
    return res.status(401).json({ success: false, message: "Silakan login terlebih dahulu." });
  }

  const result = dataStore.unenrollUser(user.id, req.params.id);
  return res.json(result);
});

router.get('/my/trainings', (req, res) => {
  const user = getUserFromHeader(req);
  if (!user) {
    return res.status(401).json({ success: false, message: "Silakan login terlebih dahulu." });
  }

  const summary = dataStore.getUserProgressSummary(user.id);
  return res.json({ success: true, data: summary });
});

// --- Material & Progress Routes ---
router.post('/materials/:id/complete', (req, res) => {
  const user = getUserFromHeader(req);
  if (!user) {
    return res.status(401).json({ success: false, message: "Silakan login terlebih dahulu." });
  }

  const result = dataStore.completeMaterial(user.id, req.params.id);
  if (!result) {
    return res.status(404).json({ success: false, message: "Materi tidak ditemukan." });
  }

  return res.json({
    success: true,
    message: "Progres materi dicatat!",
    data: result
  });
});

router.post('/trainings/:id/modules', (req, res) => {
  const { title, description, sequenceNumber } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, message: "Judul modul wajib diisi." });
  }
  if (!dataStore.trainings.some(training => training.id === req.params.id)) {
    return res.status(404).json({ success: false, message: "Pelatihan tidak ditemukan." });
  }
  const newMod = dataStore.addModule(req.params.id, { title, description, sequenceNumber });
  return res.status(201).json({ success: true, message: "Modul berhasil ditambahkan.", data: newMod });
});

router.put('/modules/:moduleId', (req, res) => {
  const { title, description, sequenceNumber } = req.body;
  if (!title) return res.status(400).json({ success: false, message: "Nama modul wajib diisi." });
  const module = dataStore.updateModule(req.params.moduleId, {
    title,
    description: description || '',
    sequenceNumber: Number(sequenceNumber) || 1
  });
  if (!module) return res.status(404).json({ success: false, message: "Modul tidak ditemukan." });
  return res.json({ success: true, message: "Modul berhasil diperbarui.", data: module });
});

router.delete('/modules/:moduleId', (req, res) => {
  const module = dataStore.deleteModule(req.params.moduleId);
  if (!module) return res.status(404).json({ success: false, message: "Modul tidak ditemukan." });
  return res.json({ success: true, message: "Modul berhasil dihapus.", data: module });
});

router.post('/modules/:moduleId/materials', (req, res) => {
  const { title, type, content, description, duration, fileUrl, fileName, videoUrl, quizData, assignmentData } = req.body;
  if (!title || !type) {
    return res.status(400).json({ success: false, message: "Judul dan jenis materi wajib diisi." });
  }
  const moduleObj = dataStore.modules.find(m => m.id === req.params.moduleId);
  if (!moduleObj) {
    return res.status(404).json({ success: false, message: "Modul tidak ditemukan." });
  }

  const newMat = dataStore.addMaterial({
    moduleId: req.params.moduleId,
    trainingId: moduleObj.trainingId,
    title,
    type,
    content,
    description,
    duration,
    fileUrl,
    fileName,
    videoUrl,
    quizData,
    assignmentData
  });

  return res.status(201).json({ success: true, message: "Materi pembelajaran berhasil ditambahkan!", data: newMat });
});

router.put('/materials/:materialId', (req, res) => {
  const { title, type, content, description, duration, fileUrl, fileName, videoUrl, quizData, assignmentData } = req.body;
  if (!title || !type) return res.status(400).json({ success: false, message: "Judul dan jenis materi wajib diisi." });
  const material = dataStore.updateMaterial(req.params.materialId, {
    title, type, content, description, duration, fileUrl, fileName, videoUrl, quizData, assignmentData
  });
  if (!material) return res.status(404).json({ success: false, message: "Materi tidak ditemukan." });
  return res.json({ success: true, message: "Materi berhasil diperbarui.", data: material });
});

router.delete('/materials/:materialId', (req, res) => {
  const material = dataStore.deleteMaterial(req.params.materialId);
  if (!material) return res.status(404).json({ success: false, message: "Materi tidak ditemukan." });
  return res.json({ success: true, message: "Materi berhasil dihapus.", data: material });
});

// --- Assignments & Submissions Routes ---
router.post('/assignments/:id/submit', (req, res) => {
  const user = getUserFromHeader(req);
  if (!user) {
    return res.status(401).json({ success: false, message: "Silakan login terlebih dahulu." });
  }

  const { content, fileName, fileUrl } = req.body;
  const submission = dataStore.submitAssignment(user.id, req.params.id, content, fileName, fileUrl);
  if (!submission) {
    return res.status(404).json({ success: false, message: "Tugas tidak ditemukan." });
  }

  return res.status(201).json({
    success: true,
    message: "Tugas berhasil dikumpulkan!",
    data: submission
  });
});

router.get('/submissions', (req, res) => {
  const submissions = dataStore.getAllSubmissions();
  return res.json({ success: true, data: submissions });
});

router.post('/submissions/:id/evaluate', (req, res) => {
  const user = getUserFromHeader(req);
  if (user && user.role !== 'admin') {
    return res.status(403).json({ success: false, message: "Akses ditolak. Fitur khusus Trainer/Admin." });
  }

  const { score, feedback } = req.body;
  if (score === undefined || score < 0 || score > 100) {
    return res.status(400).json({ success: false, message: "Nilai harus berada antara 0 - 100." });
  }

  const evaluation = dataStore.evaluateSubmission(req.params.id, user ? user.id : 'usr-3', score, feedback);
  if (!evaluation) {
    return res.status(404).json({ success: false, message: "Submission tidak ditemukan." });
  }

  return res.json({
    success: true,
    message: "Evaluasi dan nilai berhasil disimpan!",
    data: evaluation
  });
});

// --- Discussion Routes ---
router.get('/discussions', (req, res) => {
  const { trainingId, search } = req.query;
  const discussions = dataStore.getAllDiscussions(trainingId, search);
  return res.json({ success: true, data: discussions });
});

router.post('/discussions', (req, res) => {
  const user = getUserFromHeader(req);
  if (!user) {
    return res.status(401).json({ success: false, message: "Silakan login terlebih dahulu." });
  }

  const { trainingId, title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ success: false, message: "Judul dan isi diskusi wajib diisi." });
  }

  const newDisc = dataStore.createDiscussion(user.id, trainingId || "trn-101", title, content);
  return res.status(201).json({
    success: true,
    message: "Thread diskusi baru berhasil dipublikasikan!",
    data: newDisc
  });
});

router.post('/discussions/:id/replies', (req, res) => {
  const user = getUserFromHeader(req);
  if (!user) {
    return res.status(401).json({ success: false, message: "Silakan login terlebih dahulu." });
  }

  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ success: false, message: "Isi balasan tidak boleh kosong." });
  }

  const reply = dataStore.addDiscussionReply(req.params.id, user.id, content);
  if (!reply) {
    return res.status(404).json({ success: false, message: "Thread diskusi tidak ditemukan." });
  }

  return res.status(201).json({
    success: true,
    message: "Balasan berhasil dikirim!",
    data: reply
  });
});

// --- Profile Routes ---
router.get('/users/profile', (req, res) => {
  const user = getUserFromHeader(req);
  if (!user) return res.status(404).json({ success: false, message: "Pengguna tidak ditemukan." });
  return res.json({ success: true, data: user });
});

router.put('/users/profile', (req, res) => {
  const user = getUserFromHeader(req);
  if (!user) return res.status(404).json({ success: false, message: "Pengguna tidak ditemukan." });
  const { avatar } = req.body;
  if (avatar && (typeof avatar !== 'string' || !/^data:image\/(jpeg|png|webp);base64,[a-z0-9+/]+=*$/i.test(avatar))) {
    return res.status(400).json({ success: false, message: "Foto harus berupa JPG, PNG, atau WEBP yang valid." });
  }
  if (avatar && avatar.length > 1400000) {
    return res.status(413).json({ success: false, message: "Ukuran foto maksimal 1 MB." });
  }
  const updated = dataStore.updateUserProfile(user.id, req.body);
  return res.json({ success: true, message: "Profil berhasil diperbarui.", data: updated });
});

// --- Enrollment & System Testing Routes ---
router.post('/testing/seed', (req, res) => {
  dataStore.resetStore();
  return res.json({
    success: true,
    message: "Database TrainHub berhasil di-reset ke kondisi awal (Seed Data Testing)!"
  });
});

router.post('/testing/auto-complete', (req, res) => {
  const user = getUserFromHeader(req);
  const { trainingId } = req.body;
  if (!user || !trainingId) {
    return res.status(400).json({ success: false, message: "User ID dan Training ID dibutuhkan." });
  }

  // Ensure enrolled
  dataStore.enrollUser(user.id, trainingId);
  const updatedDetail = dataStore.autoCompleteCourse(user.id, trainingId);

  return res.json({
    success: true,
    message: "Semua materi pada pelatihan ini berhasil ditandai selesai (Automated Testing)!",
    data: updatedDetail
  });
});

export default router;

import express from 'express';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dataStore } from '../db/dataStore.js';
import { createSessionToken, getSessionUserId } from '../services/sessionService.js';

const router = express.Router();
const uploadsDirectory = fileURLToPath(new URL('../uploads/', import.meta.url));
const allowedFileTypes = {
  '.pdf': 'application/pdf', '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.txt': 'text/plain', '.md': 'text/markdown', '.csv': 'text/csv',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.mp3': 'audio/mpeg', '.zip': 'application/zip'
};

// Helper middleware to extract user context
const getUserFromHeader = (req) => {
  const authorization = req.headers.authorization || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : null;
  const userId = getSessionUserId(token);
  return dataStore.getUserById(userId);
};

const requireAdmin = (req, res) => {
  const user = getUserFromHeader(req);
  if (!user || user.role !== 'admin') {
    res.status(user ? 403 : 401).json({ success: false, message: 'Akses hanya untuk akun admin yang sudah login.' });
    return null;
  }
  return user;
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
    data: { user, token: createSessionToken(user.id) }
  });
});

router.post('/uploads', async (req, res) => {
  if (!requireAdmin(req, res)) return;

  const { fileName, data } = req.body;
  const safeName = typeof fileName === 'string' ? path.basename(fileName).replace(/[\\/]/g, '') : '';
  const extension = path.extname(safeName).toLowerCase();
  if (!safeName || !allowedFileTypes[extension] || typeof data !== 'string' || !/^[A-Za-z0-9+/]*={0,2}$/.test(data)) {
    return res.status(400).json({ success: false, message: 'Format file tidak didukung atau berkas tidak valid.' });
  }

  const fileBuffer = Buffer.from(data, 'base64');
  if (!fileBuffer.length || fileBuffer.length > 10 * 1024 * 1024 || fileBuffer.toString('base64') !== data) {
    return res.status(413).json({ success: false, message: 'Ukuran file maksimal 10 MB.' });
  }
  const storedName = `${randomUUID()}${extension}`;
  try {
    await mkdir(uploadsDirectory, { recursive: true });
    await writeFile(path.join(uploadsDirectory, storedName), fileBuffer, { flag: 'wx' });
    return res.status(201).json({
      success: true,
      message: 'File berhasil diunggah.',
      data: { fileName: safeName, fileUrl: `/uploads/${storedName}`, mimeType: allowedFileTypes[extension] }
    });
  } catch (error) {
    console.error('Upload file gagal:', error.message);
    return res.status(500).json({ success: false, message: 'File tidak dapat disimpan di server.' });
  }
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
  if (!requireAdmin(req, res)) return;

  const newTraining = dataStore.createTraining(req.body);
  return res.status(201).json({
    success: true,
    message: "Pelatihan baru berhasil dibuat!",
    data: newTraining
  });
});

router.put('/trainings/:id', (req, res) => {
  if (!requireAdmin(req, res)) return;

  const updated = dataStore.updateTraining(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: "Pelatihan tidak ditemukan." });
  }
  return res.json({ success: true, message: "Data pelatihan berhasil diperbarui.", data: updated });
});

router.delete('/trainings/:id', (req, res) => {
  if (!requireAdmin(req, res)) return;

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

router.get('/notifications', (req, res) => {
  const user = getUserFromHeader(req);
  if (!user) return res.status(401).json({ success: false, message: 'Silakan login terlebih dahulu.' });
  return res.json({ success: true, data: dataStore.getUserNotifications(user.id) });
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
  if (!requireAdmin(req, res)) return;
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
  if (!requireAdmin(req, res)) return;
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
  if (!requireAdmin(req, res)) return;
  const module = dataStore.deleteModule(req.params.moduleId);
  if (!module) return res.status(404).json({ success: false, message: "Modul tidak ditemukan." });
  return res.json({ success: true, message: "Modul berhasil dihapus.", data: module });
});

router.post('/modules/:moduleId/materials', (req, res) => {
  if (!requireAdmin(req, res)) return;
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
  if (!requireAdmin(req, res)) return;
  const { title, type, content, description, duration, fileUrl, fileName, videoUrl, quizData, assignmentData } = req.body;
  if (!title || !type) return res.status(400).json({ success: false, message: "Judul dan jenis materi wajib diisi." });
  const material = dataStore.updateMaterial(req.params.materialId, {
    title, type, content, description, duration, fileUrl, fileName, videoUrl, quizData, assignmentData
  });
  if (!material) return res.status(404).json({ success: false, message: "Materi tidak ditemukan." });
  return res.json({ success: true, message: "Materi berhasil diperbarui.", data: material });
});

router.delete('/materials/:materialId', (req, res) => {
  if (!requireAdmin(req, res)) return;
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
  if (!requireAdmin(req, res)) return;
  const submissions = dataStore.getAllSubmissions();
  return res.json({ success: true, data: submissions });
});

router.post('/submissions/:id/evaluate', (req, res) => {
  const user = requireAdmin(req, res);
  if (!user) return;

  const { score, feedback } = req.body;
  if (score === undefined || score < 0 || score > 100) {
    return res.status(400).json({ success: false, message: "Nilai harus berada antara 0 - 100." });
  }

  const evaluation = dataStore.evaluateSubmission(req.params.id, user.id, score, feedback);
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

export default router;

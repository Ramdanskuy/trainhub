// backend/controllers/materialController.js
import { dataStore } from '../db/dataStore.js';

export const completeMaterial = (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: 'Silakan login terlebih dahulu.' });
  }
  const result = dataStore.completeMaterial(user.id, req.params.id);
  if (!result) {
    return res.status(404).json({ success: false, message: 'Materi tidak ditemukan.' });
  }
  return res.json({ success: true, message: 'Progres materi dicatat!', data: result });
};

export const addModule = (req, res) => {
  const user = req.user;
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, message: 'Judul modul wajib diisi.' });
  }
  const newMod = dataStore.addModule(req.params.id, title);
  return res.status(201).json({ success: true, message: 'Modul berhasil ditambahkan.', data: newMod });
};

export const addMaterial = (req, res) => {
  const { title, type, content, fileUrl, videoUrl, quizData, assignmentData } = req.body;
  if (!title || !type) {
    return res.status(400).json({ success: false, message: 'Judul dan jenis materi wajib diisi.' });
  }
  const moduleObj = dataStore.modules.find(m => m.id === req.params.moduleId);
  if (!moduleObj) {
    return res.status(404).json({ success: false, message: 'Modul tidak ditemukan.' });
  }
  const newMat = dataStore.addMaterial({
    moduleId: req.params.moduleId,
    trainingId: moduleObj.trainingId,
    title,
    type,
    content,
    fileUrl,
    videoUrl,
    quizData,
    assignmentData,
  });
  return res.status(201).json({ success: true, message: 'Materi pembelajaran berhasil ditambahkan!', data: newMat });
};

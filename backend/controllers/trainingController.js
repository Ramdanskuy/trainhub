// backend/controllers/trainingController.js
import { dataStore } from '../db/dataStore.js';

export const getAllTrainings = (req, res) => {
  const user = req.user; // assumed middleware sets req.user
  const { category, level, search, includeArchived } = req.query;
  const trainings = dataStore.getAllTrainings(user ? user.id : null, {
    category,
    level,
    search,
    includeArchived: includeArchived === 'true'
  });
  return res.json({ success: true, data: trainings });
};

export const getTrainingDetail = (req, res) => {
  const user = req.user;
  const training = dataStore.getTrainingDetail(req.params.id, user ? user.id : null);
  if (!training) {
    return res.status(404).json({ success: false, message: 'Pelatihan tidak ditemukan.' });
  }
  return res.json({ success: true, data: training });
};

export const createTraining = (req, res) => {
  const user = req.user;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Akses ditolak. Fitur khusus Trainer/Admin.' });
  }
  const newTraining = dataStore.createTraining(req.body);
  return res.status(201).json({ success: true, message: 'Pelatihan baru berhasil dibuat!', data: newTraining });
};

export const updateTraining = (req, res) => {
  const user = req.user;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Akses ditolak. Fitur khusus Trainer/Admin.' });
  }
  const updated = dataStore.updateTraining(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Pelatihan tidak ditemukan.' });
  }
  return res.json({ success: true, message: 'Data pelatihan berhasil diperbarui.', data: updated });
};

export const deleteTraining = (req, res) => {
  const user = req.user;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Akses ditolak. Fitur khusus Trainer/Admin.' });
  }
  const success = dataStore.deleteTraining(req.params.id);
  if (!success) {
    return res.status(404).json({ success: false, message: 'Pelatihan tidak ditemukan.' });
  }
  return res.json({ success: true, message: 'Pelatihan berhasil diarsipkan.' });
};

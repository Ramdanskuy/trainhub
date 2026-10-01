// backend/controllers/enrollmentController.js
import { dataStore } from '../db/dataStore.js';

export const enroll = (req, res) => {
  const user = req.user; // assumed middleware
  if (!user) {
    return res.status(401).json({ success: false, message: 'Silakan login terlebih dahulu.' });
  }
  const result = dataStore.enrollUser(user.id, req.params.id);
  if (!result.success) {
    return res.status(400).json(result);
  }
  return res.json({ success: true, message: result.message, data: result.enrollment });
};

export const unenroll = (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: 'Silakan login terlebih dahulu.' });
  }
  const result = dataStore.unenrollUser(user.id, req.params.id);
  return res.json(result);
};

export const getMyTrainings = (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: 'Silakan login terlebih dahulu.' });
  }
  const summary = dataStore.getUserProgressSummary(user.id);
  return res.json({ success: true, data: summary });
};

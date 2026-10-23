// backend/controllers/authController.js
import { dataStore } from '../db/dataStore.js';
import { createSessionToken, getSessionUserId } from '../services/sessionService.js';

export const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email dan password wajib diisi.' });
  }
  const user = dataStore.login(email, password);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Email atau password tidak sesuai.' });
  }
  return res.json({
    success: true,
    message: `Selamat datang kembali, ${user.name}!`,
    data: { user, token: createSessionToken(user.id) }
  });
};

export const logout = (req, res) => {
  // Dummy logout – token handling is client‑side
  return res.json({ success: true, message: 'Berhasil keluar dari sistem.' });
};

export const getMe = (req, res) => {
  const authorization = req.headers.authorization || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : null;
  const userId = getSessionUserId(token);
  const user = dataStore.getUserById(userId);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Sesi tidak ditemukan.' });
  }
  return res.json({ success: true, data: { user } });
};

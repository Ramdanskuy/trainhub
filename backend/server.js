import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import apiRoutes from './routes/api.js';

try {
  process.loadEnvFile();
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const app = express();
const PORT = process.env.PORT || 5006;
const uploadsDirectory = path.join(path.dirname(fileURLToPath(import.meta.url)), 'uploads');

app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsDirectory, { dotfiles: 'deny', index: false }));

// Register API Routes
app.use('/api', apiRoutes);
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint API ${req.method} ${req.originalUrl} tidak ditemukan.`
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(err.status || 500).json({
      success: false,
      message: err.status === 400 ? 'Request API tidak valid.' : 'Terjadi kesalahan pada server API.'
    });
  }
  return next(err);
});

// Root health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: "ok", app: "TrainHub Backend API Service", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 TrainHub Backend Server is running on port ${PORT}`);
  console.log(`👉 API Base URL: http://localhost:${PORT}/api`);
});

// Keep event loop active
setInterval(() => {}, 1000 * 3600);


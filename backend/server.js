import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.js';

const app = express();
const PORT = process.env.PORT || 5006;

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

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


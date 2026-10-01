import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.js';

const app = express();
const PORT = process.env.PORT || 5005;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register API Routes
app.use('/api', apiRoutes);

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


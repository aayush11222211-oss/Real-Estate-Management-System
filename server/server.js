import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { initializeData } from './data/storage.js';
import authRoutes from './routes/authRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger for development
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);

// API Index endpoint
app.get('/api', (req, res) => {
  res.json({
    status: 'online',
    message: 'Rental Property Backend API is up and running!',
    endpoints: {
      health: 'http://localhost:5000/api/health',
      allProperties: 'http://localhost:5000/api/properties',
      recentProperties: 'http://localhost:5000/api/properties/recent',
      stats: 'http://localhost:5000/api/properties/stats',
      authRegister: 'POST http://localhost:5000/api/auth/register',
      authLogin: 'POST http://localhost:5000/api/auth/login'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Rental Property Listing API'
  });
});

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Rental Property Listing Backend API',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      properties: '/api/properties'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.originalUrl}`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server & Connect to DB
const startServer = async () => {
  await connectDB();
  await initializeData();

  app.listen(PORT, () => {
    console.log(`🚀 Rental Property Backend Server running on port ${PORT}`);
    console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  });
};

startServer();

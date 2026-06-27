const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const clientDistPath = path.resolve(__dirname, '../client/dist');
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173').split(',').map(origin => origin.trim()).filter(Boolean);

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-farmer')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.log('❌ MongoDB connection error:', err);
    // Continue anyway for demo purposes
  });

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    message: 'Smart Farmer Assistant API is running! 🌾',
    version: '1.0.0',
    status: 'active',
    timestamp: new Date().toISOString()
  });
});

// Routes
const farmerRoutes = require('./routes/farmer');
const expenseRoutes = require('./routes/expense');
const cropRoutes = require('./routes/crop');
const weatherRoutes = require('./routes/weather');
const insightsRoutes = require('./routes/insights');

app.use('/api/farmer', farmerRoutes);
app.use('/api/expense', expenseRoutes);
app.use('/api/crop', cropRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/insights', insightsRoutes);

// Serve built frontend assets
app.use(express.static(clientDistPath, { index: false }));

// React SPA fallback for non-API routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }

  if (req.path.includes('.')) {
    return next();
  }

  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// 404 handler for API routes
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      message: 'Endpoint not found'
    });
  }

  res.status(404).sendFile(path.join(clientDistPath, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'सर्वर त्रुटि (Server error)',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🌾 Smart Farmer Assistant is ready!`);
});

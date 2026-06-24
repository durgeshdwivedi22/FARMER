const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://192.168.68.115:3000', 'http://192.168.68.114:3001'],
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
app.get('/', (req, res) => {
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

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Endpoint not found'
  });
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

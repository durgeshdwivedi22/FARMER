const express = require('express');
const router = express.Router();
const Crop = require('../models/Crop');
const jwt = require('jsonwebtoken');
const { getRecommendations } = require('../utils/cropRecommendation');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'टोकन आवश्यक है (Token required)' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, decoded) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'अमान्य टोकन (Invalid token)' 
      });
    }
    req.farmerId = decoded.farmerId;
    next();
  });
};

// AI Crop Recommendation System
router.post('/recommend', authenticateToken, async (req, res) => {
  try {
    const { soilType, season, landSize } = req.body;

    // Validate required fields
    if (!soilType || !season || !landSize) {
      return res.status(400).json({ 
        success: false, 
        message: 'सभी आवश्यक फ़ील्ड भरें (Please fill all required fields)' 
      });
    }

    // AI-based crop recommendations
    const recommendations = getRecommendations(soilType, season, landSize);

    res.json({
      success: true,
      message: 'फसल की सिफारिशें मिलीं (Crop recommendations received)',
      data: recommendations
    });

  } catch (error) {
    console.error('Crop recommendation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'सर्वर त्रुटि (Server error)' 
    });
  }
});

// Add crop
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, season, soilType, area, expectedYield, sowingDate } = req.body;

    // Validate required fields
    if (!name || !season || !soilType || !area || !sowingDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'सभी आवश्यक फ़ील्ड भरें (Please fill all required fields)' 
      });
    }

    const crop = new Crop({
      farmerId: req.farmerId,
      name,
      season,
      soilType,
      area: parseFloat(area),
      expectedYield: expectedYield ? parseFloat(expectedYield) : undefined,
      sowingDate: new Date(sowingDate)
    });

    await crop.save();

    res.status(201).json({
      success: true,
      message: 'फसल जोड़ी गई (Crop added)',
      data: crop
    });

  } catch (error) {
    console.error('Add crop error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'सर्वर त्रुटि (Server error)' 
    });
  }
});

// Get all crops for farmer
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status } = req.query;
    
    const query = { farmerId: req.farmerId };
    if (status) {
      query.status = status;
    }

    const crops = await Crop.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: crops
    });

  } catch (error) {
    console.error('Get crops error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'सर्वर त्रुटि (Server error)' 
    });
  }
});

// Update crop
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { actualYield, actualHarvestDate, status } = req.body;

    const crop = await Crop.findOneAndUpdate(
      { _id: req.params.id, farmerId: req.farmerId },
      { 
        actualYield: actualYield ? parseFloat(actualYield) : undefined,
        actualHarvestDate: actualHarvestDate ? new Date(actualHarvestDate) : undefined,
        status: status || undefined
      },
      { new: true }
    );

    if (!crop) {
      return res.status(404).json({ 
        success: false, 
        message: 'फसल नहीं मिली (Crop not found)' 
      });
    }

    res.json({
      success: true,
      message: 'फसल अपडेट की गई (Crop updated)',
      data: crop
    });

  } catch (error) {
    console.error('Update crop error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'सर्वर त्रुटि (Server error)' 
    });
  }
});

module.exports = router;

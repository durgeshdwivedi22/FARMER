const express = require('express');
const router = express.Router();
const Farmer = require('../models/Farmer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register farmer with mobile
router.post('/register', async (req, res) => {
  try {
    const { name, mobile, village, district, state, landSize, preferredLanguage } = req.body;

    // Validate required fields
    if (!name || !mobile || !village || !district || !state || !landSize) {
      return res.status(400).json({ 
        success: false, 
        message: 'सभी आवश्यक फ़ील्ड भरें (Please fill all required fields)' 
      });
    }

    // Check if farmer already exists
    const existingFarmer = await Farmer.findOne({ mobile });
    if (existingFarmer) {
      return res.status(400).json({ 
        success: false, 
        message: 'यह मोबाइल नंबर पहले से पंजीकृत है (This mobile number is already registered)' 
      });
    }

    // Create new farmer
    const farmer = new Farmer({
      name,
      mobile,
      village,
      district,
      state,
      landSize,
      preferredLanguage: preferredLanguage || 'hindi'
    });

    await farmer.save();

    // Generate JWT token
    const token = jwt.sign(
      { farmerId: farmer._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'पंजीकरण सफल! (Registration successful!)',
      data: {
        farmer,
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'सर्वर त्रुटि (Server error)' 
    });
  }
});

// Login with mobile
router.post('/login', async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({ 
        success: false, 
        message: 'मोबाइल नंबर आवश्यक है (Mobile number is required)' 
      });
    }

    const farmer = await Farmer.findOne({ mobile });
    if (!farmer) {
      return res.status(404).json({ 
        success: false, 
        message: 'यह मोबाइल नंबर पंजीकृत नहीं है (This mobile number is not registered)' 
      });
    }

    // Generate OTP (in production, use SMS service)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in session/temp storage
    // In production, use Redis or database
    farmer.otp = otp;
    farmer.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    await farmer.save();

    // For demo, return OTP (in production, send via SMS)
    res.json({
      success: true,
      message: 'OTP भेजा गया (OTP sent)',
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'सर्वर त्रुटि (Server error)' 
    });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({ 
        success: false, 
        message: 'मोबाइल और OTP आवश्यक हैं (Mobile and OTP are required)' 
      });
    }

    const farmer = await Farmer.findOne({ mobile });
    if (!farmer) {
      return res.status(404).json({ 
        success: false, 
        message: 'किसान नहीं मिला (Farmer not found)' 
      });
    }

    // Check OTP
    if (farmer.otp !== otp || farmer.otpExpiry < new Date()) {
      return res.status(400).json({ 
        success: false, 
        message: 'अमान्य OTP (Invalid OTP)' 
      });
    }

    // Clear OTP
    farmer.otp = undefined;
    farmer.otpExpiry = undefined;
    await farmer.save();

    // Generate JWT token
    const token = jwt.sign(
      { farmerId: farmer._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'लॉगिन सफल! (Login successful!)',
      data: {
        farmer,
        token
      }
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'सर्वर त्रुटि (Server error)' 
    });
  }
});

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

// Get farmer profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.farmerId);

    if (!farmer) {
      return res.status(404).json({ 
        success: false, 
        message: 'किसान नहीं मिला (Farmer not found)' 
      });
    }

    res.json({
      success: true,
      data: farmer
    });

  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'सर्वर त्रुटि (Server error)' 
    });
  }
});

// Update farmer profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email, village, district, state, landSize, preferredLanguage } = req.body;

    const farmer = await Farmer.findByIdAndUpdate(
      req.farmerId,
      {
        name: name || undefined,
        email: email || undefined,
        village: village || undefined,
        district: district || undefined,
        state: state || undefined,
        landSize: landSize || undefined,
        preferredLanguage: preferredLanguage || undefined
      },
      { new: true }
    );

    if (!farmer) {
      return res.status(404).json({ 
        success: false, 
        message: 'किसान नहीं मिला (Farmer not found)' 
      });
    }

    res.json({
      success: true,
      message: 'प्रोफाइल अपडेट किया गया (Profile updated)',
      data: farmer
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'सर्वर त्रुटि (Server error)' 
    });
  }
});

// Get farmer summary (dashboard data)
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const Expense = require('../models/Expense');
    const Crop = require('../models/Crop');

    const farmer = await Farmer.findById(req.farmerId);
    const expenses = await Expense.find({ farmerId: req.farmerId });
    const crops = await Crop.find({ farmerId: req.farmerId });

    const totalInvestment = expenses
      .filter(e => e.type === 'investment')
      .reduce((sum, e) => sum + e.amount, 0);

    const totalProfit = expenses
      .filter(e => e.type === 'profit')
      .reduce((sum, e) => sum + e.amount, 0);

    const totalLoss = expenses
      .filter(e => e.type === 'loss')
      .reduce((sum, e) => sum + e.amount, 0);

    res.json({
      success: true,
      data: {
        farmer: {
          name: farmer.name,
          village: farmer.village,
          state: farmer.state,
          landSize: farmer.landSize
        },
        financial: {
          totalInvestment,
          totalProfit,
          totalLoss,
          netProfit: totalProfit - totalLoss,
          roi: totalInvestment > 0 ? (((totalProfit - totalLoss) / totalInvestment) * 100).toFixed(2) : 0
        },
        statistics: {
          totalExpenses: expenses.length,
          totalCrops: crops.length,
          activeCrops: crops.filter(c => c.status !== 'harvested').length
        }
      }
    });

  } catch (error) {
    console.error('Summary error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'सर्वर त्रुटि (Server error)' 
    });
  }
});

module.exports = router;

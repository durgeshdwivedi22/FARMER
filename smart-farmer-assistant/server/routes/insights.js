const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const Crop = require('../models/Crop');
const jwt = require('jsonwebtoken');
const { generateInsights } = require('../utils/insightsGenerator');

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

// Get smart insights for farmer
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Fetch expenses and crops for this farmer
    const expenses = await Expense.find({ farmerId: req.farmerId });
    const crops = await Crop.find({ farmerId: req.farmerId });

    // Generate insights
    const insights = generateInsights(expenses, crops);

    res.json({
      success: true,
      message: 'स्मार्ट सुझाव तैयार हैं (Insights generated)',
      data: insights
    });

  } catch (error) {
    console.error('Insights generation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'सर्वर त्रुटि (Server error)',
      error: error.message
    });
  }
});

// Get specific insight categories
router.get('/category/:category', authenticateToken, async (req, res) => {
  try {
    const { category } = req.params;
    const expenses = await Expense.find({ farmerId: req.farmerId, category });

    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
    const averageAmount = expenses.length > 0 ? totalAmount / expenses.length : 0;

    res.json({
      success: true,
      category,
      totalExpense: totalAmount,
      averageExpense: averageAmount,
      count: expenses.length,
      expenses
    });

  } catch (error) {
    console.error('Category insights error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'सर्वर त्रुटि (Server error)' 
    });
  }
});

module.exports = router;

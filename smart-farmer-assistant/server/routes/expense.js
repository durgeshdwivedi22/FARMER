const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const jwt = require('jsonwebtoken');

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

// Add expense
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { type, amount, category, description, date, voiceNote } = req.body;

    // Validate required fields
    if (!type || !amount || !category || !description || !date) {
      return res.status(400).json({ 
        success: false, 
        message: 'सभी आवश्यक फ़ील्ड भरें (Please fill all required fields)' 
      });
    }

    const expense = new Expense({
      farmerId: req.farmerId,
      type,
      amount: parseFloat(amount),
      category,
      description,
      date: new Date(date),
      voiceNote
    });

    await expense.save();

    res.status(201).json({
      success: true,
      message: 'लेनदेन जोड़ी गई (Transaction added)',
      data: expense
    });

  } catch (error) {
    console.error('Add expense error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'सर्वर त्रुटि (Server error)' 
    });
  }
});

// Get all expenses for farmer
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, type, startDate, endDate } = req.query;
    
    const query = { farmerId: req.farmerId };
    
    // Filter by type if provided
    if (type) {
      query.type = type;
    }
    
    // Filter by date range if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Expense.countDocuments(query);

    res.json({
      success: true,
      data: expenses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'सर्वर त्रुटि (Server error)' 
    });
  }
});

// Get expense summary
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const matchQuery = { farmerId: req.farmerId };
    
    if (startDate || endDate) {
      matchQuery.date = {};
      if (startDate) matchQuery.date.$gte = new Date(startDate);
      if (endDate) matchQuery.date.$lte = new Date(endDate);
    }

    const summary = await Expense.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Calculate total profit/loss
    let totalInvestment = 0;
    let totalProfit = 0;
    let totalLoss = 0;

    summary.forEach(item => {
      if (item._id === 'investment') totalInvestment = item.total;
      if (item._id === 'profit') totalProfit = item.total;
      if (item._id === 'loss') totalLoss = item.total;
    });

    const netProfit = totalProfit - totalLoss;

    res.json({
      success: true,
      data: {
        totalInvestment,
        totalProfit,
        totalLoss,
        netProfit,
        summary
      }
    });

  } catch (error) {
    console.error('Get summary error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'सर्वर त्रुटि (Server error)' 
    });
  }
});

// Delete expense
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      farmerId: req.farmerId
    });

    if (!expense) {
      return res.status(404).json({ 
        success: false, 
        message: 'लेनदेन नहीं मिली (Transaction not found)' 
      });
    }

    res.json({
      success: true,
      message: 'लेनदेन हटा दी गई (Transaction deleted)'
    });

  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'सर्वर त्रुटि (Server error)' 
    });
  }
});

module.exports = router;

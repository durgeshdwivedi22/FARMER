const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true
  },
  type: {
    type: String,
    enum: ['investment', 'profit', 'loss'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    enum: ['seeds', 'fertilizer', 'pesticide', 'labor', 'equipment', 'irrigation', 'harvest', 'other'],
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  date: {
    type: Date,
    required: true
  },
  voiceNote: {
    type: String, // Store original voice input if available
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Expense', expenseSchema);

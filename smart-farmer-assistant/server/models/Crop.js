const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  season: {
    type: String,
    enum: ['kharif', 'rabi', 'zaid'],
    required: true
  },
  soilType: {
    type: String,
    enum: ['clay', 'loamy', 'sandy', 'black', 'red'],
    required: true
  },
  area: {
    type: Number,
    required: true,
    min: 0
  },
  expectedYield: {
    type: Number,
    min: 0
  },
  actualYield: {
    type: Number,
    min: 0
  },
  expectedProfit: {
    type: Number,
    min: 0
  },
  actualProfit: {
    type: Number,
    min: 0
  },
  sowingDate: {
    type: Date,
    required: true
  },
  expectedHarvestDate: {
    type: Date
  },
  actualHarvestDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['planned', 'sown', 'growing', 'ready', 'harvested'],
    default: 'planned'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Crop', cropSchema);

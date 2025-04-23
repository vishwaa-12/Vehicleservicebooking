const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  make: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true
  },
  serviceHistory: [{
    date: Date,
    serviceType: String,
    description: String,
    cost: Number
  }]
});

module.exports = mongoose.model('Vehicle', VehicleSchema);
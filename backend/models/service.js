// models/Service.js
const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  },
  vehicleType: {
    type: String,
    required: true,
    enum: ['two-wheeler', 'four-wheeler', 'others']
  },
  vehicleNumber: {
    type: String,
    required: true
  },
  vehicleName: {
    type: String,
    required: true
  },
  serviceTypes: {
    type: [String],
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Service', ServiceSchema);
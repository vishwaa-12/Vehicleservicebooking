// routes/serviceRoutes.js
const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, async (req, res) => {
  try {
    console.log('Received booking request:', req.body); // Log incoming request
    
    const { vehicleType, vehicleNumber, vehicleName, vehicleId, serviceTypes, scheduledDate, notes } = req.body;

    // Enhanced validation
    if (!vehicleType || !vehicleNumber || !vehicleName || !serviceTypes || !scheduledDate) {
      console.log('Validation failed - missing fields');
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields',
        missingFields: {
          vehicleType: !vehicleType,
          vehicleNumber: !vehicleNumber,
          vehicleName: !vehicleName,
          serviceTypes: !serviceTypes || serviceTypes.length === 0,
          scheduledDate: !scheduledDate
        }
      });
    }
// Add to serviceRoutes.js
// Get all services for a user
router.get('/', protect, async (req, res) => {
  try {
    const services = await Service.find({ userId: req.user._id });
    res.json({
      success: true,
      data: services
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});
    const service = await Service.create({
      userId: req.user._id,
      vehicleId: vehicleId || null,
      vehicleType,
      vehicleNumber,
      vehicleName,
      serviceTypes,
      scheduledDate: new Date(scheduledDate),
      notes,
      status: 'pending'
    });

    console.log('Service created successfully:', service);
    res.status(201).json({
      success: true,
      data: service
    });

  } catch (err) {
    console.error('Service creation error:', err);
    
    // More specific error handling
    let errorResponse = {
      success: false,
      error: 'Server error',
      details: err.message
    };

    if (err.name === 'ValidationError') {
      errorResponse.error = 'Validation error';
      errorResponse.messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json(errorResponse);
    }
    
    res.status(500).json(errorResponse);
  }
});

module.exports = router;
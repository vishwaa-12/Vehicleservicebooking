const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get user's vehicles
// @route   GET /api/vehicles
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ userId: req.user._id });
    res.json(vehicles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// @desc    Add new vehicle
// @route   POST /api/vehicles
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { type, make, model, year, registrationNumber } = req.body;

    // Validation
    if (!type || !make || !model || !year || !registrationNumber) {
      return res.status(400).json({ error: 'Please include all required fields' });
    }

    const vehicle = await Vehicle.create({
      userId: req.user._id,
      type,
      make,
      model,
      year,
      registrationNumber
    });

    res.status(201).json(vehicle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
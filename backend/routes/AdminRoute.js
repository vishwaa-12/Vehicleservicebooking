const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// Get all service requests
router.get('/service-requests', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const requests = await ServiceRequest.find()
      .populate('user', 'name email')
      .populate('vehicle', 'registrationNumber make model');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update service request status
router.put('/service-requests/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const request = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all registered vehicles
router.get('/vehicles', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const vehicles = await Vehicle.find()
      .populate('user', 'name email')
      .sort({ registrationNumber: 1 });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find({}, 'name email phone')
      .populate('vehicles')
      .sort({ name: 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
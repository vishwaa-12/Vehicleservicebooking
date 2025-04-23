const express = require('express');
const router = express.Router();
const Service = require('../models/service');

// Get all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Book a new service
router.post('/', async (req, res) => {
  const service = new Service({
    vehicleId: req.body.vehicleId,
    userId: req.body.userId,
    serviceType: req.body.serviceType,
    scheduledDate: req.body.scheduledDate,
    status: req.body.status || 'pending',
    notes: req.body.notes
  });

  try {
    const newService = await service.save();
    res.status(201).json(newService);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
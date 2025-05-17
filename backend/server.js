const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const serviceRoutes = require('./routes/serviceRoutes');  // Add this line
const authRoutes = require('./routes/authRoutes');      // Add this line
const vehicleRoutes = require('./routes/vehicleRoutes');// Add this line

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route middleware
app.use('/api/services', serviceRoutes);  // Add this line
app.use('/api/auth', authRoutes);        // Add this line
app.use('/api/vehicles', vehicleRoutes); // Add this line

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/vehicles', vehicleRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
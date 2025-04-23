const express = require('express');
const router = express.Router();
const User = require('../models/User');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Cookie options
const cookieOptions = {
  expires: new Date(
    Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
  ),
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production'
};

// Send OTP via Email
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  
  // Validate email
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ 
      success: false,
      error: 'Please provide a valid email address' 
    });
  }

  try {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email });
    }

    // Save OTP to user
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Email options
    const mailOptions = {
      from: `Vehicle Service <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP for Vehicle Service',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Vehicle Service Booking</h2>
          <p>Your one-time password (OTP) is:</p>
          <h3 style="background: #f3f4f6; display: inline-block; padding: 10px 20px; border-radius: 5px;">
            ${otp}
          </h3>
          <p>This OTP is valid for 5 minutes.</p>
          <p style="color: #6b7280;">If you didn't request this, please ignore this email.</p>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ 
      success: true,
      message: 'OTP sent to your email' 
    });
  } catch (error) {
    console.error('Email OTP Error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to send OTP',
      details: error.message
    });
  }
});

// Verify OTP and Login
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find user with matching OTP
    const user = await User.findOne({ 
      email,
      otp,
      otpExpires: { $gt: new Date() } // Check if OTP is not expired
    });

    if (!user) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid OTP or OTP expired' 
      });
    }

    // Clear OTP after successful verification
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200)
      .cookie('token', token, cookieOptions)
      .json({
        success: true,
        token,
        user: {
          id: user._id,
          email: user.email
        }
      });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to verify OTP',
      details: error.message
    });
  }
});

// Logout
router.get('/logout', (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router;
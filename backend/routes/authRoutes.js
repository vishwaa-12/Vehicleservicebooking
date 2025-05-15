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

    // Email options with enhanced HTML template
    const mailOptions = {
      from: `Vehicle Service <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP for Vehicle Service',
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>OTP Verification</title>
          <style>
              * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              }
              body {
                  background-color: #f5f7fa;
                  padding: 20px;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  border-radius: 10px;
                  overflow: hidden;
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .header {
                  background: linear-gradient(135deg, #2563eb, #1e40af);
                  padding: 30px 20px;
                  text-align: center;
                  color: white;
              }
              .header h1 {
                  font-size: 24px;
                  margin-bottom: 10px;
              }
              .logo {
                  font-size: 28px;
                  font-weight: bold;
                  margin-bottom: 10px;
              }
              .content {
                  padding: 30px;
                  color: #4b5563;
              }
              .otp-container {
                  margin: 25px 0;
                  text-align: center;
              }
              .otp-code {
                  display: inline-block;
                  font-size: 32px;
                  font-weight: bold;
                  letter-spacing: 5px;
                  padding: 15px 25px;
                  background-color: #f3f4f6;
                  border-radius: 8px;
                  color: #1e40af;
                  margin: 15px 0;
              }
              .info-text {
                  margin-bottom: 20px;
                  line-height: 1.6;
              }
              .footer {
                  padding: 20px;
                  text-align: center;
                  font-size: 12px;
                  color: #9ca3af;
                  background-color: #f9fafb;
              }
              .button {
                  display: inline-block;
                  padding: 12px 24px;
                  background-color: #2563eb;
                  color: white;
                  text-decoration: none;
                  border-radius: 5px;
                  font-weight: 500;
                  margin-top: 15px;
              }
              .divider {
                  height: 1px;
                  background-color: #e5e7eb;
                  margin: 20px 0;
              }
              .highlight {
                  color: #1e40af;
                  font-weight: 600;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <div class="logo">Vehicle Service</div>
                  <h1>OTP Verification Code</h1>
                  <p>Secure access to your account</p>
              </div>
              
              <div class="content">
                  <p class="info-text">Hello,</p>
                  <p class="info-text">To complete your login process, please use the following One-Time Password (OTP):</p>
                  
                  <div class="otp-container">
                      <div class="otp-code">${otp}</div>
                      <p>This code is valid for <span class="highlight">5 minutes</span> only.</p>
                  </div>
                  
                  <div class="divider"></div>
                  
                  <p class="info-text">For security reasons, do not share this code with anyone. If you didn't request this OTP, please ignore this email or contact support if you have concerns.</p>
                  
                  <p class="info-text">Thank you for choosing <span class="highlight">Vehicle Service</span>!</p>
              </div>
              
              <div class="footer">
                  <p>© ${new Date().getFullYear()} Vehicle Service. All rights reserved.</p>
                  <p>This is an automated message, please do not reply directly to this email.</p>
              </div>
          </div>
      </body>
      </html>
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
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { name, number, email, state, city, address, pincode, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { number }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or mobile number already exists' });
    }

    // Create new user
    const user = new User({ name, number, email, state, city, address, pincode, password });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Signin route
router.post('/signin', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Find user by email or mobile
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { number: identifier }
      ]
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        number: user.number,
        state: user.state,
        city: user.city,
        address: user.address,
        pincode: user.pincode,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

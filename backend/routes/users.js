const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
});

router.put('/me', auth, async (req, res) => {
  try {
    const updates = (({
      name, number, email, state, city, address, pincode,
    }) => ({
      name, number, email, state, city, address, pincode,
    }))(req.body);

    const definedUpdates = Object.entries(updates)
      .filter(([, value]) => typeof value !== 'undefined')
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    if (definedUpdates.email) {
      const existingEmail = await User.findOne({
        email: definedUpdates.email.toLowerCase(),
        _id: { $ne: req.user.userId },
      });
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    if (definedUpdates.number) {
      const existingNumber = await User.findOne({
        number: definedUpdates.number,
        _id: { $ne: req.user.userId },
      });
      if (existingNumber) {
        return res.status(400).json({ message: 'Mobile number already in use' });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      definedUpdates,
      { new: true, runValidators: true, context: 'query' },
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Failed to update user profile' });
  }
});

module.exports = router;






const express = require('express');
const Complaint = require('../models/Complaint');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Get all complaints (admin only)
router.get('/complaints', adminAuth, async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('submittedBy', 'name email number')
      .sort({ createdAt: -1 });
    res.json({ complaints });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ message: 'Failed to fetch complaints' });
  }
});

// Update complaint status
router.patch('/complaints/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'in_progress', 'resolved', 'cancelled', 'on_hold', 'reopened'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('submittedBy', 'name email number');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json({ message: 'Complaint status updated successfully', complaint });
  } catch (error) {
    console.error('Error updating complaint status:', error);
    res.status(500).json({ message: 'Failed to update complaint status' });
  }
});

// Update complaint priority
router.patch('/complaints/:id/priority', adminAuth, async (req, res) => {
  try {
    const { priority } = req.body;
    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({ message: 'Invalid priority' });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { priority },
      { new: true, runValidators: true }
    ).populate('submittedBy', 'name email number');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json({ message: 'Complaint priority updated successfully', complaint });
  } catch (error) {
    console.error('Error updating complaint priority:', error);
    res.status(500).json({ message: 'Failed to update complaint priority' });
  }
});

// Get complaint by ID
router.get('/complaints/:id', adminAuth, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('submittedBy', 'name email number state city address pincode');
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json({ complaint });
  } catch (error) {
    console.error('Error fetching complaint:', error);
    res.status(500).json({ message: 'Failed to fetch complaint' });
  }
});

module.exports = router;



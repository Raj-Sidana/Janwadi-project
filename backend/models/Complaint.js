const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['infrastructure', 'sanitation', 'utilities', 'safety', 'transportation', 'environment', 'other'],
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'resolved', 'cancelled', 'on_hold', 'reopened'],
    default: 'pending',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  pincode: {
    type: String,
    required: true,
    match: /^[0-9]{6}$/,
  },
  contactPhone: {
    type: String,
    trim: true,
  },
  contactEmail: {
    type: String,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  photoUrl: {
    type: String,
    trim: true,
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: true, // Made optional for guest complaints
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Complaint', complaintSchema);

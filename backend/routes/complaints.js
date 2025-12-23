const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Complaint = require('../models/Complaint');
const auth = require('../middleware/auth');


const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'uploads', 'complaints');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

const jwt = require('jsonwebtoken');

// ...

router.post('/', upload.single('photo'), async (req, res) => {
  try {
    // Check for auth token manually for optional user tracking
    let userId = undefined;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.userId;
      } catch (err) {
        console.warn('Invalid token during complaint registration:', err.message);
        // Continue as guest
      }
    }


    const {
      title,
      category,
      description,
      state,
      city,
      address,
      pincode,
      contactPhone,
      contactEmail,
    } = req.body;

    if (!title || !category || !description || !state || !city || !address || !pincode) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const photoUrl = req.file
      ? `/uploads/complaints/${req.file.filename}`
      : null;

    const complaint = await Complaint.create({
      title,
      category,
      description,
      state,
      city,
      address,
      pincode,
      contactPhone,
      contactEmail,
      photoUrl,
      submittedBy: userId,
    });


    res
      .status(201)
      .json({ message: 'Complaint registered successfully', complaint });
  } catch (error) {
    console.error('Error creating complaint:', error);
    if (error instanceof multer.MulterError) {
      return res
        .status(400)
        .json({ message: error.message || 'File upload failed' });
    }
    res.status(500).json({ message: 'Failed to register complaint', error: error.message });
  }
});

router.get('/my-complaints', auth, async (req, res) => {
  try {
    const complaints = await Complaint.find({ submittedBy: req.user.userId })
      .sort({ createdAt: -1 });
    res.json({ complaints });
  } catch (error) {
    console.error('Error fetching user complaints:', error);
    res.status(500).json({ message: 'Failed to fetch your complaints' });
  }
});

router.get('/', async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ complaints });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ message: 'Failed to fetch complaints' });
  }
});

module.exports = router;


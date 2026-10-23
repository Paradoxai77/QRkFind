const express = require('express');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');
const Complaint = require('../models/Complaint');

const router = express.Router();

// Helper to handle database availability errors
const handleDbError = (err, res, defaultMsg) => {
  console.error(defaultMsg, err);
  if (err.name === 'MongooseServerSelectionError' || err.name === 'MongoTimeoutError') {
    return res.status(503).json({ message: 'Database temporarily unavailable. Please try again shortly.' });
  }
  return res.status(500).json({ message: defaultMsg });
};

// Multer config for photo uploads in /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `noqr-${nanoid(10)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (file.mimetype.startsWith('image/') && allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (.jpg, .jpeg, .png, .webp, .gif) are allowed'));
    }
  },
});

// Helper to extract optional auth user without rejecting unauthenticated finders
const getOptionalUser = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'qrkfind_jwt_secret_dev_2026');
      return decoded;
    } catch {
      return null;
    }
  }
  return null;
};

// GET /api/complain-box/stats — Quick counts
router.get('/stats', async (req, res) => {
  try {
    const all = await Complaint.find({});
    const stats = {
      total: all.length,
      unclaimed: all.filter(c => c.status !== 'claimed').length,
      claimed: all.filter(c => c.status === 'claimed').length,
    };
    res.json({ stats });
  } catch (err) {
    handleDbError(err, res, 'Failed to fetch complain box stats.');
  }
});

// GET /api/complain-box — list all reported objects found without QR
router.get('/', async (req, res) => {
  try {
    const { category, status, search } = req.query;
    let query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    let complaints = await Complaint.find(query).sort({ createdAt: -1 });

    // Client-side text filter for in-memory or mongo if search query provided
    if (search && search.trim()) {
      const s = search.trim().toLowerCase();
      complaints = complaints.filter(c =>
        c.title?.toLowerCase().includes(s) ||
        c.description?.toLowerCase().includes(s) ||
        c.locationFound?.toLowerCase().includes(s) ||
        c.currentLocation?.toLowerCase().includes(s) ||
        c.finderName?.toLowerCase().includes(s)
      );
    }

    res.json({ complaints });
  } catch (err) {
    handleDbError(err, res, 'Failed to fetch complain box items.');
  }
});

// POST /api/complain-box — report an object found without QR
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      locationFound,
      currentLocation,
      dateFound,
      finderName,
      finderPhone,
      finderEmail,
      lat,
      lng,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Object title is required (e.g., "Silver Watch").' });
    }
    if (!category || !category.trim()) {
      return res.status(400).json({ message: 'Category is required.' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ message: 'Description is required to help the owner identify it.' });
    }
    if (!locationFound || !locationFound.trim()) {
      return res.status(400).json({ message: 'Please specify where this object was found.' });
    }
    if (!finderName || !finderName.trim()) {
      return res.status(400).json({ message: 'Finder name is required.' });
    }
    if (!finderPhone || !finderPhone.trim()) {
      return res.status(400).json({ message: 'Contact phone number is required.' });
    }

    // Validate coordinates if provided
    let coordinates = { lat: null, lng: null };
    const numLat = parseFloat(lat);
    const numLng = parseFloat(lng);
    if (!isNaN(numLat) && !isNaN(numLng) && numLat >= -90 && numLat <= 90 && numLng >= -180 && numLng <= 180) {
      coordinates = {
        lat: Number(numLat.toFixed(6)),
        lng: Number(numLng.toFixed(6)),
      };
    }

    const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const user = getOptionalUser(req);

    const complaint = await Complaint.create({
      title: title.trim(),
      category: category.trim().toLowerCase(),
      description: description.trim(),
      locationFound: locationFound.trim(),
      currentLocation: currentLocation && currentLocation.trim() ? currentLocation.trim() : 'With Finder',
      coordinates,
      dateFound: dateFound ? new Date(dateFound) : new Date(),
      photoUrl,
      finderName: finderName.trim(),
      finderPhone: finderPhone.trim(),
      finderEmail: finderEmail && finderEmail.trim() ? finderEmail.trim().toLowerCase() : null,
      reportedBy: user ? user.id : null,
      status: 'unclaimed',
      claimedBy: null,
    });

    res.status(201).json({
      complaint,
      message: 'Item lodged in Complain Box successfully! Owners can now view and claim it.',
    });
  } catch (err) {
    handleDbError(err, res, 'Failed to report found object.');
  }
});

// GET /api/complain-box/:id — single item details
router.get('/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Reported object not found.' });
    }
    res.json({ complaint });
  } catch (err) {
    handleDbError(err, res, 'Failed to fetch object details.');
  }
});

// PATCH /api/complain-box/:id/claim — mark object as claimed by rightful owner
router.patch('/:id/claim', async (req, res) => {
  try {
    const { claimerName, claimerPhone, notes } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Reported object not found.' });
    }

    complaint.status = 'claimed';
    complaint.claimedBy = {
      name: claimerName ? claimerName.trim() : 'Verified Owner',
      phone: claimerPhone ? claimerPhone.trim() : 'N/A',
      notes: notes ? notes.trim() : 'Claimed directly through QRkFind Complain Box',
      claimedAt: new Date().toISOString(),
    };

    await complaint.save();

    res.json({
      complaint,
      message: 'Object marked as Claimed! Thank you for helping return lost property.',
    });
  } catch (err) {
    handleDbError(err, res, 'Failed to update claim status.');
  }
});

// DELETE /api/complain-box/:id — remove report (by reporter or admin)
router.delete('/:id', async (req, res) => {
  try {
    const user = getOptionalUser(req);
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Object not found.' });
    }

    // If authenticated, check if user is the reporter or admin
    if (user && complaint.reportedBy && complaint.reportedBy !== user.id && user.role !== 'admin' && user.email !== 'pratiknerpagar2@gmail.com') {
      return res.status(403).json({ message: 'You do not have permission to delete this report.' });
    }

    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ message: 'Report deleted from Complain Box.' });
  } catch (err) {
    handleDbError(err, res, 'Failed to delete report.');
  }
});

module.exports = router;

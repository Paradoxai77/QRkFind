const express = require('express');
const multer = require('multer');
const path = require('path');
const { nanoid } = require('nanoid');
const Item = require('../models/Item');
const FoundReport = require('../models/FoundReport');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Multer config — store uploaded photos in /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${nanoid(10)}${ext}`);
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

// All routes require auth
router.use(authMiddleware);

// GET /api/items — list all items for logged-in user
router.get('/', async (req, res) => {
  try {
    const items = await Item.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json({ items });
  } catch (err) {
    console.error('Get items error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/items — create new item
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const { name, category, description } = req.body;

    if (!name || !category) {
      return res.status(400).json({ message: 'Name and category are required.' });
    }

    const itemId = nanoid(12);
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const item = await Item.create({
      itemId,
      owner: req.user.id,
      name,
      category,
      description: description || '',
      photoUrl,
      status: 'active',
    });

    res.status(201).json({ item });
  } catch (err) {
    console.error('Create item error:', err);
    res.status(500).json({ message: 'Server error creating item.' });
  }
});

// ── Specific routes MUST come before /:id param routes ──

// GET /api/items/notifications/all — all reports across all user items
router.get('/notifications/all', async (req, res) => {
  try {
    const items = await Item.find({ owner: req.user.id }).select('_id name category');
    const itemIds = items.map(i => i._id);

    const reports = await FoundReport.find({ item: { $in: itemIds } })
      .populate('item', 'name category itemId status')
      .sort({ createdAt: -1 });

    res.json({ reports });
  } catch (err) {
    console.error('Get notifications error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// PATCH /api/items/reports/:reportId/read — mark report as read
router.patch('/reports/:reportId/read', async (req, res) => {
  try {
    const report = await FoundReport.findById(req.params.reportId);
    if (!report) return res.status(404).json({ message: 'Report not found.' });

    // Validate that the report's associated item belongs to the logged-in user (IDOR prevention)
    const item = await Item.findOne({ _id: report.item, owner: req.user.id });
    if (!item) {
      return res.status(403).json({ message: 'Unauthorized. You do not own the item associated with this report.' });
    }

    report.isRead = true;
    await report.save();

    res.json({ report });
  } catch (err) {
    console.error('Mark report read error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/items/:id — get single item details + found reports
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, owner: req.user.id });
    if (!item) return res.status(404).json({ message: 'Item not found.' });

    const reports = await FoundReport.find({ item: item._id }).sort({ createdAt: -1 });

    res.json({ item, reports });
  } catch (err) {
    console.error('Get item error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// PATCH /api/items/:id/status — update item status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'lost', 'recovered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const item = await Item.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      { status },
      { new: true }
    );

    if (!item) return res.status(404).json({ message: 'Item not found.' });
    res.json({ item });
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/items/:id
router.delete('/:id', async (req, res) => {
  try {
    const item = await Item.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!item) return res.status(404).json({ message: 'Item not found.' });

    await FoundReport.deleteMany({ item: item._id });

    res.json({ message: 'Item deleted successfully.' });
  } catch (err) {
    console.error('Delete item error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;

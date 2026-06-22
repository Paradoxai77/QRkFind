const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Item = require('../models/Item');
const FoundReport = require('../models/FoundReport');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Protect all admin routes
router.use(authMiddleware, adminMiddleware);

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const users = await User.find({});
    const items = await Item.find({});
    const reports = await FoundReport.find({});

    const stats = {
      totalUsers: users.length,
      totalItems: items.length,
      totalReports: reports.length,
      activeItems: items.filter(i => i.status === 'active').length,
      lostItems: items.filter(i => i.status === 'lost').length,
      recoveredItems: items.filter(i => i.status === 'recovered').length,
    };

    res.json({ stats });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ message: 'Failed to fetch admin stats.' });
  }
});

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    const items = await Item.find({});

    const usersWithStats = users.map(u => {
      const userItems = items.filter(i => i.owner.toString() === u._id.toString());
      return {
        _id: u._id,
        name: u.name,
        email: u.email,
        role: u.role || 'user',
        createdAt: u.createdAt,
        itemCount: userItems.length,
      };
    });

    res.json({ users: usersWithStats });
  } catch (err) {
    console.error('Admin users error:', err);
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
});

// GET /api/admin/items
router.get('/items', async (req, res) => {
  try {
    const items = await Item.find({});
    const users = await User.find({});
    const reports = await FoundReport.find({});

    const itemsWithStats = items.map(i => {
      const owner = users.find(u => u._id.toString() === i.owner.toString());
      const itemReports = reports.filter(r => r.item?.toString() === i._id.toString() || r.itemId === i.itemId);
      return {
        _id: i._id,
        itemId: i.itemId,
        name: i.name,
        category: i.category,
        description: i.description,
        status: i.status,
        createdAt: i.createdAt,
        owner: owner ? { name: owner.name, email: owner.email } : { name: 'Unknown', email: 'N/A' },
        reportCount: itemReports.length,
      };
    });

    res.json({ items: itemsWithStats });
  } catch (err) {
    console.error('Admin items error:', err);
    res.status(500).json({ message: 'Failed to fetch items.' });
  }
});

// GET /api/admin/reports
router.get('/reports', async (req, res) => {
  try {
    const reports = await FoundReport.find({});
    const items = await Item.find({});
    const users = await User.find({});

    const populatedReports = reports.map(r => {
      const item = items.find(i => i._id.toString() === r.item?.toString() || i.itemId === r.itemId);
      let owner = null;
      if (item) {
        owner = users.find(u => u._id.toString() === item.owner.toString());
      }
      return {
        _id: r._id,
        finderName: r.finderName,
        finderPhone: r.finderPhone,
        finderEmail: r.finderEmail,
        message: r.message,
        location: r.location,
        isRead: r.isRead,
        createdAt: r.createdAt,
        item: item ? { _id: item._id, name: item.name, itemId: item.itemId } : null,
        owner: owner ? { name: owner.name, email: owner.email } : null,
      };
    });

    res.json({ reports: populatedReports });
  } catch (err) {
    console.error('Admin reports error:', err);
    res.status(500).json({ message: 'Failed to fetch reports.' });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    if (userId === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own admin account.' });
    }

    // 1. Delete user
    await User.findByIdAndDelete(userId);

    // 2. Find and delete user's items
    const userItems = await Item.find({ owner: userId });
    const itemIds = userItems.map(i => i._id);

    await Item.deleteMany({ owner: userId });

    // 3. Delete reports related to user's items
    for (const itemId of itemIds) {
      await FoundReport.deleteMany({ item: itemId });
    }

    res.json({ message: 'User and all associated items and reports deleted safely.' });
  } catch (err) {
    console.error('Admin delete user error:', err);
    res.status(500).json({ message: 'Failed to delete user.' });
  }
});

// DELETE /api/admin/items/:id
router.delete('/items/:id', async (req, res) => {
  try {
    const itemId = req.params.id;
    await Item.findByIdAndDelete(itemId);
    await FoundReport.deleteMany({ item: itemId });

    res.json({ message: 'Item and associated found reports deleted safely.' });
  } catch (err) {
    console.error('Admin delete item error:', err);
    res.status(500).json({ message: 'Failed to delete item.' });
  }
});

// DELETE /api/admin/reports/:id
router.delete('/reports/:id', async (req, res) => {
  try {
    const reportId = req.params.id;
    await FoundReport.findByIdAndDelete(reportId);
    res.json({ message: 'Report deleted safely.' });
  } catch (err) {
    console.error('Admin delete report error:', err);
    res.status(500).json({ message: 'Failed to delete report.' });
  }
});

module.exports = router;

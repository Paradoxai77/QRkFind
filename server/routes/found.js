const express = require('express');
const Item = require('../models/Item');
const FoundReport = require('../models/FoundReport');
const User = require('../models/User');
const { sendFoundItemEmail } = require('../utils/sendEmail');

const router = express.Router();

// GET /api/found/:itemId — get public item info (no owner details exposed)
router.get('/:itemId', async (req, res) => {
  try {
    const item = await Item.findOne({ itemId: req.params.itemId });
    if (!item) {
      return res.status(404).json({ message: 'Item not found. The QR code may be invalid.' });
    }

    // Only return safe public info — never expose owner identity
    res.json({
      item: {
        itemId: item.itemId,
        name: item.name,
        category: item.category,
        description: item.description,
        status: item.status,
      },
    });
  } catch (err) {
    console.error('Public get item error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/found/:itemId — submit finder report
router.post('/:itemId', async (req, res) => {
  try {
    const { finderName, finderPhone, finderEmail, message, location } = req.body;

    if (!finderName || !finderPhone) {
      return res.status(400).json({ message: 'Name and phone number are required.' });
    }

    const item = await Item.findOne({ itemId: req.params.itemId });
    if (!item) {
      return res.status(404).json({ message: 'Item not found.' });
    }

    // Fetch the owner for email notification
    const owner = await User.findById(item.owner);

    // Create the found report
    const report = await FoundReport.create({
      item: item._id,
      itemId: item.itemId,
      finderName,
      finderPhone,
      finderEmail: finderEmail || null,
      message: message || '',
      location: location || { lat: null, lng: null },
    });

    // Send email notification to owner (non-blocking — don't fail if email fails)
    if (owner) {
      const dashboardUrl = `${process.env.CLIENT_URL}/dashboard/item/${item._id}`;
      const timestamp = new Date(report.createdAt).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });

      sendFoundItemEmail({
        ownerEmail: owner.email,
        ownerName: owner.name,
        itemName: item.name,
        finderName,
        finderPhone,
        finderEmail: finderEmail || null,
        message: message || '',
        location: location || null,
        timestamp,
        dashboardUrl,
      }).catch(err => console.error('Email send failed (non-fatal):', err.message));
    }

    res.status(201).json({
      message: 'Report submitted successfully! The owner has been notified.',
      report: { id: report._id, createdAt: report.createdAt },
    });
  } catch (err) {
    console.error('Submit found report error:', err);
    res.status(500).json({ message: 'Server error submitting report.' });
  }
});

module.exports = router;

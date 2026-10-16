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
      return res.status(404).json({ message: 'Item not found. The QR code may be invalid or retired.' });
    }

    // Only return safe public info — never expose owner identity (privacy guarantee)
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
    if (err.name === 'MongooseServerSelectionError' || err.name === 'MongoTimeoutError') {
      return res.status(503).json({ message: 'Database temporarily unavailable. Please try again shortly.' });
    }
    res.status(500).json({ message: 'Server error loading item details.' });
  }
});

// POST /api/found/:itemId — submit finder report
router.post('/:itemId', async (req, res) => {
  try {
    const { finderName, finderPhone, finderEmail, message, location } = req.body;

    if (!finderName || !finderName.trim()) {
      return res.status(400).json({ message: 'Finder name is required.' });
    }
    if (!finderPhone || !finderPhone.trim()) {
      return res.status(400).json({ message: 'Contact phone number is required.' });
    }

    const item = await Item.findOne({ itemId: req.params.itemId });
    if (!item) {
      return res.status(404).json({ message: 'Item not found. The QR code may be invalid.' });
    }

    // Rigorous GPS location validation:
    // Ensures coordinates are finite, valid geographical numbers.
    // If user denies location or GPS is unavailable, stores strictly { lat: null, lng: null }
    let validatedLocation = { lat: null, lng: null };
    const hasValidCoords =
      location &&
      typeof location.lat === 'number' &&
      typeof location.lng === 'number' &&
      !isNaN(location.lat) &&
      !isNaN(location.lng) &&
      location.lat >= -90 &&
      location.lat <= 90 &&
      location.lng >= -180 &&
      location.lng <= 180;

    if (hasValidCoords) {
      validatedLocation = {
        lat: Number(location.lat.toFixed(6)),
        lng: Number(location.lng.toFixed(6)),
      };
    }

    // Fetch the owner for notification dispatch
    const owner = await User.findById(item.owner);

    // Persist the found report to database
    const report = await FoundReport.create({
      item: item._id,
      itemId: item.itemId,
      finderName: finderName.trim(),
      finderPhone: finderPhone.trim(),
      finderEmail: finderEmail && finderEmail.trim() ? finderEmail.trim().toLowerCase() : null,
      message: message && message.trim() ? message.trim() : '',
      location: validatedLocation,
    });

    // Send email alert to owner if registered and configured
    let emailStatus = { success: false, reason: 'Owner not found' };
    if (owner && owner.email) {
      const clientUrl = process.env.CLIENT_URL || 'https://paradoxai77.github.io/QRkFind';
      const dashboardUrl = `${clientUrl}/dashboard/item/${item._id}`;
      const timestamp = new Date(report.createdAt).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });

      emailStatus = await sendFoundItemEmail({
        ownerEmail: owner.email,
        ownerName: owner.name,
        itemName: item.name,
        finderName: finderName.trim(),
        finderPhone: finderPhone.trim(),
        finderEmail: finderEmail && finderEmail.trim() ? finderEmail.trim().toLowerCase() : null,
        message: message && message.trim() ? message.trim() : '',
        location: hasValidCoords ? validatedLocation : null,
        timestamp,
        dashboardUrl,
      });
    }

    // Provide a precise, accurate message based on what was actually accomplished
    let confirmationMessage = 'Report saved successfully! Delivered to the owner’s dashboard.';
    if (emailStatus.success) {
      confirmationMessage = 'Report saved successfully! The owner has been notified via email and in their dashboard.';
    }

    res.status(201).json({
      message: confirmationMessage,
      report: { id: report._id, createdAt: report.createdAt },
      emailDelivered: emailStatus.success,
      locationCaptured: hasValidCoords,
    });
  } catch (err) {
    console.error('Submit found report error:', err);
    if (err.name === 'MongooseServerSelectionError' || err.name === 'MongoTimeoutError') {
      return res.status(503).json({ message: 'Database temporarily unavailable. Please try again shortly.' });
    }
    res.status(500).json({ message: 'Server error submitting report. Please try again.' });
  }
});

module.exports = router;

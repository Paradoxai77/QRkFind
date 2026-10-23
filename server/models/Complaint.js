if (process.env.USE_MOCK_DB === 'true') {
  module.exports = require('../utils/mockDb').Complaint;
} else {
  const mongoose = require('mongoose');

  const complaintSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        required: [true, 'Object title is required'],
        trim: true,
        maxlength: [120, 'Title cannot exceed 120 characters'],
      },
      category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true,
      },
      description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters'],
      },
      locationFound: {
        type: String,
        required: [true, 'Location where found is required'],
        trim: true,
        maxlength: [200, 'Location cannot exceed 200 characters'],
      },
      currentLocation: {
        type: String,
        trim: true,
        default: 'With Finder',
        maxlength: [200, 'Current location cannot exceed 200 characters'],
      },
      coordinates: {
        lat: { type: Number, default: null },
        lng: { type: Number, default: null },
      },
      dateFound: {
        type: Date,
        default: Date.now,
      },
      photoUrl: {
        type: String,
        default: null,
      },
      finderName: {
        type: String,
        required: [true, 'Finder name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters'],
      },
      finderPhone: {
        type: String,
        required: [true, 'Finder contact phone is required'],
        trim: true,
      },
      finderEmail: {
        type: String,
        trim: true,
        lowercase: true,
        default: null,
      },
      reportedBy: {
        type: String,
        default: null,
      },
      status: {
        type: String,
        enum: ['unclaimed', 'claimed'],
        default: 'unclaimed',
      },
      claimedBy: {
        name: { type: String, default: null },
        phone: { type: String, default: null },
        notes: { type: String, default: null },
        claimedAt: { type: Date, default: null },
      },
    },
    { timestamps: true }
  );

  module.exports = mongoose.model('Complaint', complaintSchema);
}

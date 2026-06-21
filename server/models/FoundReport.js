if (process.env.USE_MOCK_DB === 'true') {
  module.exports = require('../utils/mockDb').FoundReport;
} else {
  const mongoose = require('mongoose');

  const foundReportSchema = new mongoose.Schema(
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true,
      },
      itemId: {
        type: String,
        required: true,
        index: true,
      },
      finderName: {
        type: String,
        required: [true, 'Finder name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters'],
      },
      finderPhone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
      },
      finderEmail: {
        type: String,
        trim: true,
        lowercase: true,
        default: null,
      },
      message: {
        type: String,
        trim: true,
        maxlength: [1000, 'Message cannot exceed 1000 characters'],
      },
      location: {
        lat: { type: Number, default: null },
        lng: { type: Number, default: null },
      },
      isRead: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
  );

  module.exports = mongoose.model('FoundReport', foundReportSchema);
}

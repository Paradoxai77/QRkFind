if (process.env.USE_MOCK_DB === 'true') {
  module.exports = require('../utils/mockDb').Item;
} else {
  const mongoose = require('mongoose');

  const itemSchema = new mongoose.Schema(
    {
      itemId: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      name: {
        type: String,
        required: [true, 'Item name is required'],
        trim: true,
        maxlength: [100, 'Item name cannot exceed 100 characters'],
      },
      category: {
        type: String,
        required: [true, 'Category is required'],
        enum: [
          'phone',
          'keys',
          'wallet',
          'bag',
          'umbrella',
          'laptop',
          'headphones',
          'glasses',
          'watch',
          'camera',
          'book',
          'calculator',
          'other',
        ],
        default: 'other',
      },
      description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters'],
      },
      photoUrl: {
        type: String,
        default: null,
      },
      status: {
        type: String,
        enum: ['active', 'lost', 'recovered'],
        default: 'active',
      },
    },
    { timestamps: true }
  );

  module.exports = mongoose.model('Item', itemSchema);
}

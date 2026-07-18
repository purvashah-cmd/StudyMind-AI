const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'onModel'
    },
    onModel: {
      type: String,
      required: true,
      enum: ['Content', 'Message']
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Bookmark', bookmarkSchema);

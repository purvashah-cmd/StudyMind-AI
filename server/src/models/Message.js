const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'ai'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    citations: [
      {
        pageNumber: Number,
        snippet: String,
      }
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Message', messageSchema);

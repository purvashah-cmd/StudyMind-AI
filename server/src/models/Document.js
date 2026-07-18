const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    originalFileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    pageCount: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['processing', 'ready', 'failed'],
      default: 'processing',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    userNotes: {
      type: String,
      default: '',
    },
    todos: [{
      id: String,
      text: String,
      completed: {
        type: Boolean,
        default: false,
      }
    }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Document', documentSchema);

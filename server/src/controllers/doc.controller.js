const Document = require('../models/Document');
const path = require('path');
const fs = require('fs');

// @desc    Upload a new document
// @route   POST /api/documents/upload
// @access  Private
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { originalname, filename, path: filePath, size, mimetype } = req.file;
    const ext = path.extname(originalname).toLowerCase().replace('.', '');
    
    // In a real app, you would determine page count (e.g., using pdf-parse)
    const pageCount = 0; 

    const newDoc = await Document.create({
      userId: req.user._id,
      title: req.body.title || originalname,
      originalFileName: originalname,
      fileUrl: filePath, // Just storing local path for now
      fileType: ext || 'txt',
      fileSize: size,
      pageCount: pageCount,
      status: 'processing' // Will be updated by AI pipeline later
    });

    res.status(201).json(newDoc);

    // Trigger AI processing pipeline (async)
    const { processDocument } = require('../services/ai.service');
    processDocument(filePath, ext || 'txt', newDoc._id)
      .then(async () => {
         await Document.findByIdAndUpdate(newDoc._id, { status: 'ready' });
      })
      .catch(async (err) => {
         console.error('AI Processing error:', err);
         await Document.findByIdAndUpdate(newDoc._id, { status: 'failed' });
      });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's active documents
// @route   GET /api/documents
// @access  Private
const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.user._id, isDeleted: false }).sort({ createdAt: -1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's recycled documents
// @route   GET /api/documents/recycled
// @access  Private
const getRecycledDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.user._id, isDeleted: true }).sort({ deletedAt: -1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single document
// @route   GET /api/documents/:id
// @access  Private
const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Rename document
// @route   PUT /api/documents/:id
// @access  Private
const renameDocument = async (req, res) => {
  try {
    const { title } = req.body;
    
    if (!title) {
       return res.status(400).json({ message: 'Title is required' });
    }

    const document = await Document.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { title },
      { new: true }
    );
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Soft delete document
// @route   DELETE /api/documents/:id
// @access  Private
const softDeleteDocument = async (req, res) => {
  try {
    const document = await Document.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json({ message: 'Document moved to recycle bin', document });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Restore document
// @route   POST /api/documents/:id/restore
// @access  Private
const restoreDocument = async (req, res) => {
  try {
    const document = await Document.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isDeleted: false, deletedAt: null },
      { new: true }
    );
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json({ message: 'Document restored', document });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Permanently delete document
// @route   DELETE /api/documents/:id/permanent
// @access  Private
const permanentDeleteDocument = async (req, res) => {
  try {
    const document = await Document.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Delete file from filesystem
    if (fs.existsSync(document.fileUrl)) {
        fs.unlinkSync(document.fileUrl);
    }

    // Delete associated content
    const Content = require('../models/Content');
    await Content.deleteMany({ documentId: document._id });

    // Delete associated chats and messages
    const Chat = require('../models/Chat');
    const Message = require('../models/Message');
    const chats = await Chat.find({ documentId: document._id });
    for (let chat of chats) {
        await Message.deleteMany({ chatId: chat._id });
    }
    await Chat.deleteMany({ documentId: document._id });

    await Document.deleteOne({ _id: document._id });

    res.json({ message: 'Document permanently deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDocumentContent = async (req, res) => {
  try {
    const Content = require('../models/Content');
    const contents = await Content.find({ documentId: req.params.id, userId: req.user._id });
    res.json(contents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  getRecycledDocuments,
  getDocumentById,
  renameDocument,
  softDeleteDocument,
  restoreDocument,
  permanentDeleteDocument,
  getDocumentContent
};

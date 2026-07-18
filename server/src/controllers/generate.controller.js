const { generateSummary, generateNotes, generateQuiz, generateMindMap } = require('../services/ai.service');
const Content = require('../models/Content');
const Document = require('../models/Document');

// @desc    Generate or get Summary
// @route   POST /api/generate/summary/:documentId
// @access  Private
const generateOrGetSummary = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { type } = req.body || {}; // 'short', 'medium', 'detailed'

    // Check if doc exists
    const doc = await Document.findOne({ _id: documentId, userId: req.user._id });
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    // Check if we already have a summary of this type
    const existingContent = await Content.findOne({ 
        documentId, 
        userId: req.user._id, 
        type: 'summary', 
        'data.summaryType': type || 'medium' 
    });

    if (existingContent) {
        return res.json(existingContent);
    }

    // Generate new summary
    const summaryText = await generateSummary(documentId, type);

    const newContent = await Content.create({
        documentId,
        userId: req.user._id,
        type: 'summary',
        data: {
            text: summaryText,
            summaryType: type || 'medium'
        }
    });

    res.status(201).json(newContent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate or get Notes
// @route   POST /api/generate/notes/:documentId
// @access  Private
const generateOrGetNotes = async (req, res) => {
  try {
    const { documentId } = req.params;

    const doc = await Document.findOne({ _id: documentId, userId: req.user._id });
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    const existingContent = await Content.findOne({ documentId, userId: req.user._id, type: 'notes' });
    if (existingContent) return res.json(existingContent);

    const notesText = await generateNotes(documentId);

    const newContent = await Content.create({
        documentId,
        userId: req.user._id,
        type: 'notes',
        data: { text: notesText }
    });

    res.status(201).json(newContent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate or get Quiz
// @route   POST /api/generate/quiz/:documentId
// @access  Private
const generateOrGetQuiz = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { difficulty } = req.body || {};

    const doc = await Document.findOne({ _id: documentId, userId: req.user._id });
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    const existingContent = await Content.findOne({ 
        documentId, 
        userId: req.user._id, 
        type: 'quiz',
        'data.difficulty': difficulty || 'Medium'
    });
    if (existingContent) return res.json(existingContent);

    const quizData = await generateQuiz(documentId, difficulty);

    const newContent = await Content.create({
        documentId,
        userId: req.user._id,
        type: 'quiz',
        data: { questions: quizData, difficulty: difficulty || 'Medium' }
    });

    res.status(201).json(newContent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate or get Mind Map
// @route   POST /api/generate/mindmap/:documentId
// @access  Private
const generateOrGetMindMap = async (req, res) => {
  try {
    const { documentId } = req.params;

    const doc = await Document.findOne({ _id: documentId, userId: req.user._id });
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    const existingContent = await Content.findOne({ documentId, userId: req.user._id, type: 'mindmap' });
    if (existingContent) return res.json(existingContent);

    const mindMapData = await generateMindMap(documentId);

    const newContent = await Content.create({
        documentId,
        userId: req.user._id,
        type: 'mindmap',
        data: mindMapData
    });

    res.status(201).json(newContent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateOrGetSummary,
  generateOrGetNotes,
  generateOrGetQuiz,
  generateOrGetMindMap
};

const { chatWithDocument } = require('../services/ai.service');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const Document = require('../models/Document');

// @desc    Send a message to the AI
// @route   POST /api/chat/:documentId
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ message: 'Message content is required' });
    }

    const doc = await Document.findOne({ _id: documentId, userId: req.user._id });
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    // Find or create chat
    let chat = await Chat.findOne({ documentId, userId: req.user._id });
    if (!chat) {
        chat = await Chat.create({ documentId, userId: req.user._id });
    }

    // Fetch previous messages for context (last 10 messages)
    const history = await Message.find({ chatId: chat._id }).sort({ createdAt: 1 }).limit(10);
    const formattedHistory = history.map(msg => ({ role: msg.role, content: msg.content }));

    // Save user message
    const userMessage = await Message.create({
        chatId: chat._id,
        role: 'user',
        content
    });

    // Get AI response via RAG
    const aiResponseText = await chatWithDocument(documentId, content, formattedHistory);

    // Save AI message
    const aiMessage = await Message.create({
        chatId: chat._id,
        role: 'ai',
        content: aiResponseText
    });

    // Update chat timestamp
    chat.updatedAt = Date.now();
    await chat.save();

    res.status(200).json({ userMessage, aiMessage });
  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get chat history
// @route   GET /api/chat/:documentId
// @access  Private
const getHistory = async (req, res) => {
    try {
        const { documentId } = req.params;
        
        const chat = await Chat.findOne({ documentId, userId: req.user._id });
        if (!chat) {
            return res.status(200).json([]);
        }

        const messages = await Message.find({ chatId: chat._id }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
  sendMessage,
  getHistory
};

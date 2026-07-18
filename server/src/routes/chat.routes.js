const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const { sendMessage, getHistory } = require('../controllers/chat.controller');

router.use(protect);

router.post('/:documentId', sendMessage);
router.get('/:documentId', getHistory);

module.exports = router;

const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const {
  generateOrGetSummary,
  generateOrGetNotes,
  generateOrGetQuiz,
  generateOrGetMindMap
} = require('../controllers/generate.controller');

router.use(protect);

router.post('/summary/:documentId', generateOrGetSummary);
router.post('/notes/:documentId', generateOrGetNotes);
router.post('/quiz/:documentId', generateOrGetQuiz);
router.post('/mindmap/:documentId', generateOrGetMindMap);

module.exports = router;

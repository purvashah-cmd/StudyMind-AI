const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const {
  uploadDocument,
  getDocuments,
  getRecycledDocuments,
  getDocumentById,
  renameDocument,
  softDeleteDocument,
  restoreDocument,
  permanentDeleteDocument,
  getDocumentContent,
  updateWorkspace
} = require('../controllers/doc.controller');

// All routes are protected
router.use(protect);

router.post('/upload', upload.single('file'), uploadDocument);
router.get('/', getDocuments);
router.get('/recycled', getRecycledDocuments);
router.get('/:id', getDocumentById);
router.get('/:id/content', getDocumentContent);
router.put('/:id', renameDocument);
router.put('/:id/workspace', updateWorkspace);
router.delete('/:id', softDeleteDocument);
router.post('/:id/restore', restoreDocument);
router.delete('/:id/permanent', permanentDeleteDocument);

module.exports = router;

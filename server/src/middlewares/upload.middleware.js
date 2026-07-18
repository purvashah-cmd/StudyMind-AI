const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Create unique filename
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Check file type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /pdf|doc|docx|txt|md/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype) || file.mimetype === 'application/pdf' || file.mimetype === 'text/plain' || file.mimetype === 'text/markdown';

  if (extname) { // simplified for basic use
    return cb(null, true);
  } else {
    cb('Error: Only PDFs, TXTs and Markdown files are allowed!');
  }
}

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

module.exports = upload;

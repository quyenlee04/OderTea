const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const upload = require('../middleware/upload');

// Upload file route
router.post('/', upload.single('image_path'), uploadController.uploadFile);

module.exports = router;
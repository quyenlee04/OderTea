const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authentication middleware
router.use(authMiddleware.authenticate);

// Get all users - admin only
router.get('/', authMiddleware.authorize('admin'), userController.getAllUsers);

// Get user by ID
router.get('/:id', authMiddleware.authorize('admin'), userController.getUserById);

// Update user
router.put('/:id', authMiddleware.authorize('admin'), userController.updateUser);

// Delete user
router.delete('/:id', authMiddleware.authorize('admin'), userController.deleteUser);

module.exports = router;
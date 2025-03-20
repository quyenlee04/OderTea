const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

// Create a new order
router.post('/', orderController.createOrder);

// Get user's orders
router.get('/user/:userId', orderController.getUserOrders);

// Get order details
router.get('/:id', orderController.getOrderDetails);

// Get all orders (admin only)
router.get('/', orderController.getAllOrders);

// Update order status (admin/staff only)
router.patch('/:id/status', orderController.updateOrderStatus);

module.exports = router;
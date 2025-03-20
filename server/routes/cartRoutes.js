const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Get user's cart
router.get('/:userId', cartController.getCart);

// Add to cart
router.post('/', cartController.addToCart);

// Update cart item quantity
router.patch('/:id', cartController.updateQuantity);

// Remove from cart
router.delete('/:id', cartController.removeFromCart);

// Clear cart
router.delete('/user/:userId', cartController.clearCart);

module.exports = router;
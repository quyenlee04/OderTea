const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middleware/upload');

// Get all products
router.get('/', productController.getAllProducts);

// Get product by ID
router.get('/:id', productController.getProductById);

// Update product quantity
router.patch('/:id', productController.updateProductQuantity);

// Create new product
// Make sure the field name matches what's being sent from the client form
// Change from 'image' to 'image_path' if that's what your form is using
router.post('/', upload.single('image_path'), productController.createProduct);

// Delete product
router.delete('/:id', productController.deleteProduct);

// Update product
router.put('/:id', upload.single('image'), productController.updateProduct);

// Add this new route
router.post('/products/:id/return-quantity', productController.returnQuantity);

module.exports = router;
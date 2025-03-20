const Product = require('../models/productModel');

// Get all products
exports.getAllProducts = (req, res) => {
    Product.getAll((err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu' });
        }
        res.json(results);
    });
};

// Get product by ID
exports.getProductById = (req, res) => {
    const productId = req.params.id;
    
    Product.getById(productId, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Sản phẩm không tìm thấy' });
        }
        res.json(results[0]);
    });
};

// Update product quantity
exports.updateProductQuantity = (req, res) => {
    const id = req.params.id;
    const { quality } = req.body;
    
    // Validate input
    if (quality === undefined || quality === null) {
        return res.status(400).json({ error: 'Số lượng sản phẩm không hợp lệ' });
    }
    
    // Make sure quality is a number
    const newQuality = Number(quality);
    if (isNaN(newQuality) || newQuality < 0) {
        return res.status(400).json({ error: 'Số lượng sản phẩm phải là số không âm' });
    }
    
    Product.updateQuantity(id, newQuality, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Lỗi khi cập nhật sản phẩm' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
        }
        
        res.json({ message: 'Cập nhật số lượng sản phẩm thành công' });
    });
};

// Create new product
exports.createProduct = (req, res) => {
    const { name, price, description, quality } = req.body;
    // Update the field name to match what's being sent from the client
    const image_path = req.file ? req.file.path : null;
    
    Product.create({ name, price, description, quality, image_path }, (err, result) => {
        if (err) {
            console.error('Error creating product:', err); // Add logging for debugging
            return res.status(500).json({ error: 'Lỗi khi thêm sản phẩm' });
        }
        res.status(201).json({
            message: 'Thêm sản phẩm thành công',
            productId: result.insertId
        });
    });
};

// Delete product
exports.deleteProduct = (req, res) => {
    const productId = req.params.id;
    
    Product.delete(productId, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi khi xóa sản phẩm' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
        }
        res.json({ message: 'Xóa sản phẩm thành công' });
    });
};

// Update product
exports.updateProduct = (req, res) => {
    const productId = req.params.id;
    const { name, price, description, quality } = req.body;
    const image_path = req.file ? req.file.path : null;
    
    Product.update(productId, { name, price, description, quality, image_path }, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi khi cập nhật sản phẩm' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
        }
        res.json({ message: 'Cập nhật sản phẩm thành công' });
    });
};

// Add this new controller method
exports.returnQuantity = (req, res) => {
  const productId = req.params.id;
  const { quantity } = req.body;
  
  if (!productId || !quantity || isNaN(quantity) || quantity <= 0) {
    return res.status(400).json({ error: 'Invalid product ID or quantity' });
  }
  
  // Update product quantity in database
  Product.updateQuantity(productId, quantity, (err, result) => {
    if (err) {
      console.error('Error returning quantity:', err);
      return res.status(500).json({ error: 'Failed to update product quantity' });
    }
    
    return res.status(200).json({ message: 'Product quantity updated successfully' });
  });
};
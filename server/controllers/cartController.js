const Cart = require('../models/cartModel');

// Get user's cart
exports.getCart = (req, res) => {
    const userId = req.params.userId;
    console.log('Getting cart for user ID:', userId);
    
    Cart.getCartByUserId(userId, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu', details: err.message });
        }
        console.log('Cart results:', results);
        res.json(results);
    });
};

// Add to cart
exports.addToCart = (req, res) => {
    const { userId, productId, quantity } = req.body;
    console.log('Adding to cart:', { userId, productId, quantity });
    
    if (!userId || !productId || !quantity) {
        return res.status(400).json({ error: 'Thiếu thông tin cần thiết' });
    }
    
    Cart.addToCart(userId, productId, quantity, (err, result) => {
        if (err) {
            console.error('Add to cart error:', err);
            return res.status(500).json({ error: 'Lỗi khi thêm vào giỏ hàng', details: err.message });
        }
        res.status(201).json({ message: 'Thêm vào giỏ hàng thành công', result });
    });
};

// Update cart item quantity
exports.updateQuantity = (req, res) => {
    const cartId = req.params.id;
    const { quantity } = req.body;
    
    if (!quantity) {
        return res.status(400).json({ error: 'Thiếu thông tin số lượng' });
    }
    
    Cart.updateQuantity(cartId, quantity, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi khi cập nhật giỏ hàng' });
        }
        res.json({ message: 'Cập nhật giỏ hàng thành công' });
    });
};

// Remove from cart
exports.removeFromCart = (req, res) => {
    const cartId = req.params.id;
    
    Cart.removeFromCart(cartId, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi khi xóa sản phẩm khỏi giỏ hàng' });
        }
        res.json({ message: 'Xóa sản phẩm khỏi giỏ hàng thành công' });
    });
};

// Clear cart
exports.clearCart = (req, res) => {
    const userId = req.params.userId;
    
    Cart.clearCart(userId, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi khi xóa giỏ hàng' });
        }
        res.json({ message: 'Xóa giỏ hàng thành công' });
    });
};
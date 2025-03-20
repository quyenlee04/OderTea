const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');

exports.createOrder = (req, res) => {
    const { shipping_address, payment_method } = req.body;
    const user_id = req.body.user_id;
    
    if (!user_id || !shipping_address || !payment_method) {
        return res.status(400).json({ error: 'Thiếu thông tin đặt hàng' });
    }
    
    // Get cart items - Fix the method name here
    Cart.getCartByUserId(user_id, (err, cartItems) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi khi truy vấn giỏ hàng' });
        }
        
        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ error: 'Giỏ hàng trống' });
        }
        
        // Calculate total
        const total_amount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Prepare order items
        const items = cartItems.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price
        }));
        
        // Create order
        Order.create({
            user_id,
            total_amount,
            shipping_address,
            payment_method,
            items
        }, (err, result) => {
            if (err) {
                console.error('Order creation error:', err);
                return res.status(500).json({ error: 'Lỗi khi tạo đơn hàng' });
            }
            
            // Clear cart after successful order
            Cart.clearCart(user_id, (err) => {
                if (err) {
                    console.error('Cart clearing error:', err);
                    // Still return success for order, just log the error
                }
                
                res.status(201).json({
                    message: 'Đặt hàng thành công',
                    order_id: result.id
                });
            });
        });
    });
};

exports.getUserOrders = (req, res) => {
    const userId = req.params.userId;
    
    Order.getByUserId(userId, (err, orders) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi khi truy vấn đơn hàng' });
        }
        
        res.json(orders);
    });
};

exports.getOrderDetails = (req, res) => {
    const orderId = req.params.id;
    
    Order.getById(orderId, (err, order) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi khi truy vấn chi tiết đơn hàng' });
        }
        
        if (!order) {
            return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
        }
        
        res.json(order);
    });
};

exports.getAllOrders = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    Order.getAll(page, limit, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi khi truy vấn danh sách đơn hàng' });
        }
        
        res.json(result);
    });
};

exports.updateOrderStatus = (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body;
    
    if (!status) {
        return res.status(400).json({ error: 'Thiếu trạng thái đơn hàng' });
    }
    
    Order.updateStatus(orderId, status, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi khi cập nhật trạng thái đơn hàng' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
        }
        
        res.json({ message: 'Cập nhật trạng thái đơn hàng thành công' });
    });
};
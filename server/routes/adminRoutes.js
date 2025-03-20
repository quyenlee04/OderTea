const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

// Login routes (no auth required)
router.get('/login', (req, res) => {
    res.render('admin/login', { title: 'Đăng nhập quản trị' });
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    User.findByUsername(username, async (err, results) => {
        if (err || results.length === 0) {
            return res.render('admin/login', { 
                title: 'Đăng nhập quản trị',
                error: 'Tên đăng nhập hoặc mật khẩu không đúng'
            });
        }
        
        const user = results[0];
        
        // Check if user is admin or staff
        if (user.role !== 'admin' && user.role !== 'staff') {
            return res.render('admin/login', { 
                title: 'Đăng nhập quản trị',
                error: 'Bạn không có quyền truy cập trang quản trị'
            });
        }
        
        try {
            const passwordMatch = await bcrypt.compare(password, user.password);
            
            if (!passwordMatch) {
                return res.render('admin/login', { 
                    title: 'Đăng nhập quản trị',
                    error: 'Tên đăng nhập hoặc mật khẩu không đúng'
                });
            }
            
            // Create token
            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role },
                process.env.JWT_SECRET || 'your_jwt_secret',
                { expiresIn: '24h' }
            );
            
            // Check if session exists before setting user
            if (req.session) {
                req.session.user = { id: user.id, username: user.username, role: user.role };
            } else {
                console.warn('Session object not available');
            }
            
            // Set a cookie with the token as a fallback
            res.cookie('auth_token', token, { 
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            });
            
            // Redirect to dashboard
            res.redirect('/admin/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            res.render('admin/login', { 
                title: 'Đăng nhập quản trị',
                error: 'Đã xảy ra lỗi, vui lòng thử lại'
            });
        }
    });
});

// Protected routes
router.use(authMiddleware.authenticate);
router.use(authMiddleware.authorize('admin', 'staff'));

// Dashboard
router.get('/dashboard', adminController.getDashboard);

// Users management (admin only)
router.get('/users', authMiddleware.authorize('admin'), adminController.getUsers);

// Products management
router.get('/products', adminController.getProducts);

// Orders management
router.get('/orders', adminController.getOrders);
router.get('/orders/:id', adminController.getOrderDetails);

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

module.exports = router;
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = (req, res) => {
    const { username, fullname, password, email, address, phone } = req.body;

    // Check for existing username, email, and phone
    User.checkExisting(username, email, phone, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi hệ thống, vui lòng thử lại sau' });
        }

        if (results.length > 0) {
            const existing = results[0];
            if (existing.username === username) {
                return res.status(400).json({ error: 'Tên đăng nhập đã tồn tại' });
            }
            if (existing.email === email) {
                return res.status(400).json({ error: 'Email đã được sử dụng' });
            }
            if (existing.phone === phone) {
                return res.status(400).json({ error: 'Số điện thoại đã được sử dụng' });
            }
        }

        // If no duplicates found, proceed with registration
        User.create({ username, fullname, password, email, address, phone }, (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Lỗi khi đăng ký, vui lòng thử lại' });
            }
            res.status(201).json({ message: 'Đăng ký thành công' });
        });
    });
};

// Login user
exports.login = (req, res) => {
    const { username, password } = req.body;
    
    User.findByUsername(username, async (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn cơ sở dữ liệu:', err.message);
            return res.status(500).json({ error: 'Lỗi máy chủ' });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: 'Thông tin đăng nhập không hợp lệ' });
        }
        const user = results[0];

        try {
            // Compare the provided password with the stored hash
            const passwordMatch = await bcrypt.compare(password, user.password);
            
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Thông tin đăng nhập không hợp lệ' });
            }

            // Don't send the password to the client
            const { password: _, ...userWithoutPassword } = user;
            
            // Generate JWT token
            const token = jwt.sign(
                { 
                    id: user.id, 
                    username: user.username,
                    role: user.role 
                },
                process.env.JWT_SECRET || 'your_jwt_secret',
                { expiresIn: '24h' }
            );
            
            res.status(200).json({ 
                message: 'Đăng nhập thành công', 
                user: userWithoutPassword,
                token
            });
        } catch (error) {
            console.error('Lỗi khi so sánh mật khẩu:', error);
            return res.status(500).json({ error: 'Lỗi máy chủ' });
        }
    });
};

// Get current user
exports.getCurrentUser = (req, res) => {
    User.findById(req.user.id, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy người dùng' });
        }
        
        res.json(results[0]);
    });
};
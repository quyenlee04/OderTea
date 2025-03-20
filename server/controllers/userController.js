const User = require('../models/userModel');
const bcrypt = require('bcrypt');

// Admin users page
exports.getUsers = (req, res) => {
    User.getAllUsers((err, users) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).render('admin/error', { 
                message: 'Đã xảy ra lỗi khi tải danh sách người dùng',
                user: req.user
            });
        }
        
        res.render('admin/users', {
            title: 'Quản lý người dùng',
            user: req.user,
            users,
            getRoleText: (role) => {
                const roleMap = {
                    'customer': 'Khách hàng',
                    'staff': 'Nhân viên',
                    'admin': 'Quản trị viên'
                };
                return roleMap[role] || role;
            }
        });
    });
};

// API endpoints for user management
exports.getAllUsers = (req, res) => {
    User.getAllUsers((err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ error: 'Đã xảy ra lỗi khi tải danh sách người dùng' });
        }
        
        res.json(results);
    });
};

exports.getUserById = (req, res) => {
    const userId = req.params.id;
    
    User.findById(userId, (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ error: 'Đã xảy ra lỗi khi tải thông tin người dùng' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy người dùng' });
        }
        
        res.json(results[0]);
    });
};

exports.updateUser = (req, res) => {
    const userId = req.params.id;
    const { fullname, email, phone, address, role, password } = req.body;
    
    // Update user info
    User.updateUser(userId, { fullname, email, address, phone, role }, (err, result) => {
        if (err) {
            console.error('Error updating user:', err);
            return res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật người dùng' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy người dùng' });
        }
        
        // If password is provided, update it separately
        if (password) {
            User.updatePassword(userId, password, (err, result) => {
                if (err) {
                    console.error('Error updating password:', err);
                    return res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật mật khẩu' });
                }
                
                res.json({ message: 'Cập nhật người dùng thành công' });
            });
        } else {
            res.json({ message: 'Cập nhật người dùng thành công' });
        }
    });
};

exports.deleteUser = (req, res) => {
    const userId = req.params.id;
    
    User.deleteUser(userId, (err, result) => {
        if (err) {
            console.error('Error deleting user:', err);
            return res.status(500).json({ error: 'Đã xảy ra lỗi khi xóa người dùng' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy người dùng' });
        }
        
        res.json({ message: 'Xóa người dùng thành công' });
    });
};
const db = require('../config/database');

// Dashboard
exports.getDashboard = (req, res) => {
    try {
        // Get counts for dashboard stats
        const statsPromises = [
            // Count total products
            new Promise((resolve, reject) => {
                db.query('SELECT COUNT(*) as count FROM products', (err, results) => {
                    if (err) reject(err);
                    resolve(results[0].count);
                });
            }),
            // Count total orders
            new Promise((resolve, reject) => {
                db.query('SELECT COUNT(*) as count FROM orders', (err, results) => {
                    if (err) reject(err);
                    resolve(results[0].count);
                });
            }),
            // Count total users
            new Promise((resolve, reject) => {
                db.query('SELECT COUNT(*) as count FROM users', (err, results) => {
                    if (err) reject(err);
                    resolve(results[0].count);
                });
            }),
            // Get total revenue
            new Promise((resolve, reject) => {
                db.query('SELECT SUM(total_amount) as total FROM orders', (err, results) => {
                    if (err) reject(err);
                    resolve(results[0].total || 0);
                });
            }),
            // Get recent orders
            new Promise((resolve, reject) => {
                db.query(
                    'SELECT o.*, u.fullname FROM orders o LEFT JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC LIMIT 5', 
                    (err, results) => {
                        if (err) reject(err);
                        resolve(results);
                    }
                );
            })
        ];

        Promise.all(statsPromises)
            .then(([productCount, orderCount, userCount, totalRevenue, recentOrders]) => {
                res.render('admin/dashboard', {
                    title: 'Dashboard',
                    user: req.user,
                    stats: {
                        productCount,
                        orderCount,
                        userCount,
                        totalRevenue
                    },
                    recentOrders
                });
            })
            .catch(error => {
                console.error('Dashboard error:', error);
                res.status(500).render('admin/error', { 
                    message: 'Đã xảy ra lỗi khi tải dữ liệu dashboard',
                    user: req.user
                });
            });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).render('admin/error', { 
            message: 'Đã xảy ra lỗi khi tải dữ liệu dashboard',
            user: req.user
        });
    }
};

// Users management
exports.getUsers = (req, res) => {
    const searchTerm = req.query.search || '';
    
    let query = 'SELECT * FROM users';
    let params = [];
    
    if (searchTerm) {
        query += ' WHERE username LIKE ? OR fullname LIKE ? OR email LIKE ? OR phone LIKE ?';
        const searchPattern = `%${searchTerm}%`;
        params = [searchPattern, searchPattern, searchPattern, searchPattern];
    }
    
    query += ' ORDER BY id DESC';
    
    db.query(query, params, (err, users) => {
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
            searchTerm,
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

// Products management
exports.getProducts = (req, res) => {
    db.query('SELECT * FROM products ORDER BY id DESC', (err, products) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).render('admin/error', { 
                message: 'Đã xảy ra lỗi khi tải danh sách sản phẩm',
                user: req.user
            });
        }
        
        res.render('admin/products', {
            title: 'Quản lý sản phẩm',
            user: req.user,
            products
        });
    });
};

// Orders management
exports.getOrders = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    const status = req.query.status || '';
    
    let query = `
        SELECT o.*, u.fullname, 
        (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
    `;
    
    let countQuery = 'SELECT COUNT(*) as total FROM orders';
    
    if (status) {
        query += ` WHERE o.status = ?`;
        countQuery += ` WHERE status = ?`;
    }
    
    query += ` ORDER BY o.created_at DESC LIMIT ? OFFSET ?`;
    
    const queryParams = status ? [status, limit, offset] : [limit, offset];
    const countParams = status ? [status] : [];
    
    db.query(countQuery, countParams, (err, countResult) => {
        if (err) {
            console.error('Error counting orders:', err);
            return res.status(500).render('admin/error', { 
                message: 'Đã xảy ra lỗi khi tải danh sách đơn hàng',
                user: req.user
            });
        }
        
        const totalOrders = countResult[0].total;
        const totalPages = Math.ceil(totalOrders / limit);
        
        db.query(query, queryParams, (err, orders) => {
            if (err) {
                console.error('Error fetching orders:', err);
                return res.status(500).render('admin/error', { 
                    message: 'Đã xảy ra lỗi khi tải danh sách đơn hàng',
                    user: req.user
                });
            }
            
            res.render('admin/orders', {
                title: 'Quản lý đơn hàng',
                user: req.user,
                orders,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems: totalOrders
                },
                selectedStatus: status,
                getStatusText: (status) => {
                    const statusMap = {
                        'pending': 'Chờ xử lý',
                        'processing': 'Đang xử lý',
                        'shipped': 'Đang giao',
                        'delivered': 'Đã giao',
                        'cancelled': 'Đã hủy'
                    };
                    return statusMap[status] || status;
                }
            });
        });
    });
};

// Order details
exports.getOrderDetails = (req, res) => {
    const orderId = req.params.id;
    
    // Get order details
    db.query(
        `SELECT o.*, u.fullname as user_fullname, u.email as user_email, u.phone as user_phone
         FROM orders o
         LEFT JOIN users u ON o.user_id = u.id
         WHERE o.id = ?`,
        [orderId],
        (err, results) => {
            if (err || results.length === 0) {
                console.error('Error fetching order:', err);
                return res.status(404).render('admin/error', { 
                    message: 'Không tìm thấy đơn hàng',
                    user: req.user
                });
            }
            
            const order = results[0];
            
            // Get order items
            db.query(
                `SELECT oi.*, p.name, p.image_path
                 FROM order_items oi
                 JOIN products p ON oi.product_id = p.id
                 WHERE oi.order_id = ?`,
                [orderId],
                (err, items) => {
                    if (err) {
                        console.error('Error fetching order items:', err);
                        return res.status(500).render('admin/error', { 
                            message: 'Đã xảy ra lỗi khi tải chi tiết đơn hàng',
                            user: req.user
                        });
                    }
                    
                    order.items = items;
                    
                    res.render('admin/order-details', {
                        title: `Chi tiết đơn hàng #${orderId}`,
                        user: req.user,
                        order,
                        getStatusText: (status) => {
                            const statusMap = {
                                'pending': 'Chờ xử lý',
                                'processing': 'Đang xử lý',
                                'shipped': 'Đang giao',
                                'delivered': 'Đã giao',
                                'cancelled': 'Đã hủy'
                            };
                            return statusMap[status] || status;
                        }
                    });
                }
            );
        }
    );
};
const db = require('../config/database');

class Order {
    static create(orderData, callback) {
        const { user_id, total_amount, shipping_address, payment_method, items } = orderData;
        
        // Start a transaction
        db.beginTransaction(err => {
            if (err) return callback(err);
            
            // Insert order
            const orderSql = 'INSERT INTO orders (user_id, total_amount, shipping_address, payment_method) VALUES (?, ?, ?, ?)';
            db.query(orderSql, [user_id, total_amount, shipping_address, payment_method], (err, result) => {
                if (err) {
                    return db.rollback(() => callback(err));
                }
                
                const orderId = result.insertId;
                
                // Insert order items
                const itemValues = items.map(item => [orderId, item.product_id, item.quantity, item.price]);
                const itemsSql = 'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?';
                
                db.query(itemsSql, [itemValues], (err) => {
                    if (err) {
                        return db.rollback(() => callback(err));
                    }
                    
                    // Update product quantities
                    const updatePromises = items.map(item => {
                        return new Promise((resolve, reject) => {
                            const updateSql = 'UPDATE products SET quality = quality - ? WHERE id = ?';
                            db.query(updateSql, [item.quantity, item.product_id], (err) => {
                                if (err) reject(err);
                                else resolve();
                            });
                        });
                    });
                    
                    Promise.all(updatePromises)
                        .then(() => {
                            db.commit(err => {
                                if (err) {
                                    return db.rollback(() => callback(err));
                                }
                                callback(null, { id: orderId });
                            });
                        })
                        .catch(err => {
                            db.rollback(() => callback(err));
                        });
                });
            });
        });
    }
    
    static getByUserId(userId, callback) {
        const sql = `
            SELECT o.*, 
                   COUNT(oi.id) as item_count,
                   GROUP_CONCAT(p.name SEPARATOR ', ') as product_names
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN products p ON oi.product_id = p.id
            WHERE o.user_id = ?
            GROUP BY o.id
            ORDER BY o.created_at DESC
        `;
        db.query(sql, [userId], callback);
    }
    
    static getById(orderId, callback) {
        const orderSql = 'SELECT * FROM orders WHERE id = ?';
        db.query(orderSql, [orderId], (err, orders) => {
            if (err) return callback(err);
            if (orders.length === 0) return callback(null, null);
            
            const order = orders[0];
            
            const itemsSql = `
                SELECT oi.*, p.name, p.image_path
                FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                WHERE oi.order_id = ?
            `;
            
            db.query(itemsSql, [orderId], (err, items) => {
                if (err) return callback(err);
                
                order.items = items;
                callback(null, order);
            });
        });
    }
    
    static getAll(page = 1, limit = 10, callback) {
        const offset = (page - 1) * limit;
        
        const countSql = 'SELECT COUNT(*) as total FROM orders';
        db.query(countSql, (err, countResult) => {
            if (err) return callback(err);
            
            const total = countResult[0].total;
            const totalPages = Math.ceil(total / limit);
            
            const sql = `
                SELECT o.*, u.username, u.fullname,
                       COUNT(oi.id) as item_count
                FROM orders o
                JOIN users u ON o.user_id = u.id
                JOIN order_items oi ON o.id = oi.order_id
                GROUP BY o.id
                ORDER BY o.created_at DESC
                LIMIT ? OFFSET ?
            `;
            
            db.query(sql, [parseInt(limit), offset], (err, orders) => {
                if (err) return callback(err);
                
                callback(null, {
                    orders,
                    pagination: {
                        total,
                        totalPages,
                        currentPage: page,
                        limit
                    }
                });
            });
        });
    }
    
    static updateStatus(orderId, status, callback) {
        const sql = 'UPDATE orders SET status = ? WHERE id = ?';
        db.query(sql, [status, orderId], callback);
    }
}

module.exports = Order;
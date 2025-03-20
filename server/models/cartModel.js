const db = require('../config/database');

class Cart {
    static getCartByUserId(userId, callback) {
        const sql = `
            SELECT c.id, c.user_id, c.product_id, c.quantity, p.name, p.price, p.image_path
            FROM cart c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_id = ?
        `;
        db.query(sql, [userId], callback);
    }

    static addToCart(userId, productId, quantity, callback) {
        // Check if product already exists in cart
        const checkSql = 'SELECT * FROM cart WHERE user_id = ? AND product_id = ?';
        db.query(checkSql, [userId, productId], (err, results) => {
            if (err) {
                return callback(err);
            }

            if (results.length > 0) {
                // Update quantity if product already in cart
                const newQuantity = results[0].quantity + quantity;
                const updateSql = 'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?';
                db.query(updateSql, [newQuantity, userId, productId], callback);
            } else {
                // Add new product to cart
                const insertSql = 'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)';
                db.query(insertSql, [userId, productId, quantity], callback);
            }
        });
    }

    static updateQuantity(cartId, quantity, callback) {
        const sql = 'UPDATE cart SET quantity = ? WHERE id = ?';
        db.query(sql, [quantity, cartId], callback);
    }

    static removeFromCart(cartId, callback) {
        const sql = 'DELETE FROM cart WHERE id = ?';
        db.query(sql, [cartId], callback);
    }

    static clearCart(userId, callback) {
        const sql = 'DELETE FROM cart WHERE user_id = ?';
        db.query(sql, [userId], callback);
    }
}

module.exports = Cart;
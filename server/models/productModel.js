const db = require('../config/database');

class Product {
    static getAll(callback) {
        const sql = 'SELECT * FROM products';
        db.query(sql, callback);
    }

    static getById(id, callback) {
        const sql = 'SELECT * FROM products WHERE id = ?';
        db.query(sql, [id], callback);
    }

    static updateQuantity(id, quality, callback) {
        const sql = 'UPDATE products SET quality = ? WHERE id = ?';
        db.query(sql, [quality, id], callback);
    }

    static create(productData, callback) {
        const { name, price, description, quality, image_path } = productData;
        const sql = 'INSERT INTO products (name, price, description, quality, image_path) VALUES (?, ?, ?, ?, ?)';
        db.query(sql, [name, price, description, quality, image_path], callback);
    }

    static delete(id, callback) {
        const sql = 'DELETE FROM products WHERE id = ?';
        db.query(sql, [id], callback);
    }

    static update(id, productData, callback) {
        const { name, price, description, quality, image_path } = productData;
        
        let sql, params;
        if (image_path) {
            sql = 'UPDATE products SET name = ?, price = ?, description = ?, quality = ?, image_path = ? WHERE id = ?';
            params = [name, price, description, quality, image_path, id];
        } else {
            sql = 'UPDATE products SET name = ?, price = ?, description = ?, quality = ? WHERE id = ?';
            params = [name, price, description, quality, id];
        }
        
        db.query(sql, params, callback);
    }
}

module.exports = Product;
const db = require('../config/database');
const bcrypt = require('bcrypt');

class User {
    static checkExisting(username, email, phone, callback) {
        const sql = 'SELECT username, email, phone FROM users WHERE username = ? OR email = ? OR phone = ?';
        db.query(sql, [username, email, phone], callback);
    }

    static create(userData, callback) {
        const { username, fullname, password, email, address, phone, role = 'customer' } = userData;

        // Hash the password
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return callback(err);
            }

            const sql = 'INSERT INTO users (username, fullname, password, email, address, phone, role) VALUES (?, ?, ?, ?, ?, ?, ?)';
            db.query(sql, [username, fullname, hashedPassword, email, address, phone, role], callback);
        });
    }

    static findByUsername(username, callback) {
        const sql = 'SELECT * FROM users WHERE username = ?';
        db.query(sql, [username], callback);
    }
    
    static deleteUser(id, callback) {
        const sql = 'DELETE FROM users WHERE id = ?';
        db.query(sql, [id], callback);
    }
    
    static getAllUsers(callback) {
        const sql = 'SELECT id, username, fullname, email, address, phone, role, created_at FROM users';
        db.query(sql, callback);
    }
    
    static updateUser(id, userData, callback) {
        const { fullname, email, address, phone, role } = userData;
        const sql = 'UPDATE users SET fullname = ?, email = ?, address = ?, phone = ?, role = ? WHERE id = ?';
        db.query(sql, [fullname, email, address, phone, role, id], callback);
    }
    
    static updatePassword(id, password, callback) {
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return callback(err);
            }
            const sql = 'UPDATE users SET password = ? WHERE id = ?';
            db.query(sql, [hashedPassword, id], callback);
        });
    }
    
    static findById(id, callback) {
        const sql = 'SELECT id, username, fullname, email, address, phone, role FROM users WHERE id = ?';
        db.query(sql, [id], callback);
    }
}

module.exports = User;
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
app.use('/uploads', express.static('uploads'));


app.use(cors());
app.use(bodyParser.json());
// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_odertea'
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL connected...');
});
app.get('/', (req, res) => {
    res.send('Server is running');
});
app.post('/upload', upload.single('image_path'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.send(`File uploaded successfully: ${req.file.path}`);
});

app.post('/register', (req, res) => {
    const { username, fullname, password, email, address, phone } = req.body;

    // Check for existing username, email, and phone
    const checkSQL = 'SELECT username, email, phone FROM register WHERE username = ? OR email = ? OR phone = ?';
    
    db.query(checkSQL, [username, email, phone], (err, results) => {
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
        const insertSQL = 'INSERT INTO register (username, fullname, password, email, address, phone) VALUES (?, ?, ?, ?, ?, ?)';
        
        db.query(insertSQL, [username, fullname, password, email, address, phone], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Lỗi khi đăng ký, vui lòng thử lại' });
            }
            res.status(201).json({ message: 'Đăng ký thành công' });
        });
    });
});



app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM register WHERE username = ?';
    db.query(sql, [username], (err, results) => {
        if (err) {
            console.error('Lỗi truy vấn cơ sở dữ liệu:', err.message);
            return res.status(500).json({ error: 'Lỗi máy chủ' });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: 'Thông tin đăng nhập không hợp lệ' });
        }
        const user = results[0];

        // So sánh mật khẩu
        if (password !== user.password) {
            return res.status(401).json({ error: 'Thông tin đăng nhập không hợp lệ' });
        }
        
        res.status(200).json({ message: 'Đăng nhập thành công', user });
    });
});


app.get('/products', (req, res) => {
    const sql = 'SELECT * FROM products';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu' });
        }
        res.json(results);
    });
});
app.get('/products/:id', (req, res) => {
    const productId = req.params.id;
    const sql = 'SELECT * FROM products WHERE id = ?'; // Truy vấn sản phẩm theo ID
    db.query(sql, [productId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Sản phẩm không tìm thấy' });
        }
        res.json(results[0]); // Gửi sản phẩm đầu tiên (có thể có nhiều sản phẩm nhưng ID là duy nhất)
    });
});

app.patch('/products/:id', (req, res) => {
    const productId = req.params.id;
    const { quality } = req.body;
    const sql = 'UPDATE products SET quality = ? WHERE id = ?';
    db.query(sql, [quality, productId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi khi cập nhật sản phẩm' });
        }
        res.json({ message: 'Cập nhật số lượng sản phẩm thành công' });
    });
});
app.post('/products', upload.single('image'), (req, res) => {
    const { name, price, description, quality } = req.body;
    const image_path = req.file ? req.file.path : null;

    const sql = 'INSERT INTO products (name, price, description, quality, image_path) VALUES (?, ?, ?, ?, ?)';
    
    db.query(sql, [name, price, description, quality, image_path], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi khi thêm sản phẩm' });
        }
        res.status(201).json({ 
            message: 'Thêm sản phẩm thành công',
            productId: result.insertId 
        });
    });
});

app.delete('/products/:id', (req, res) => {
    const productId = req.params.id;
    const sql = 'DELETE FROM products WHERE id = ?';
    
    db.query(sql, [productId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi khi xóa sản phẩm' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
        }
        res.json({ message: 'Xóa sản phẩm thành công' });
    });
});
app.put('/products/:id', upload.single('image'), (req, res) => {
    const productId = req.params.id;
    const { name, price, description, quality } = req.body;
    const image_path = req.file ? req.file.path : null;

    let sql, params;
    
    if (image_path) {
        sql = 'UPDATE products SET name = ?, price = ?, description = ?, quality = ?, image_path = ? WHERE id = ?';
        params = [name, price, description, quality, image_path, productId];
    } else {
        sql = 'UPDATE products SET name = ?, price = ?, description = ?, quality = ? WHERE id = ?';
        params = [name, price, description, quality, productId];
    }

    db.query(sql, params, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Lỗi khi cập nhật sản phẩm' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
        }
        res.json({ message: 'Cập nhật sản phẩm thành công' });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

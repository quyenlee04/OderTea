require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const cookieParser = require('cookie-parser');

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Database connection
const db = require('./config/database');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Session middleware - make sure this is before your routes
app.use(session({
  secret: process.env.JWT_SECRET || 'your_jwt_secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use('/uploads', express.static('uploads'));
app.use('/static', express.static(path.join(__dirname, 'src/public')));

// Set up view engine
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'pug');

// Connect to database
db.connect((err) => {
  if (err) throw err;
  console.log('MySQL connected...');
});

// Routes
app.get('/', (req, res) => {
  res.send('Server is running');
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Add this with your other route imports
const userRoutes = require('./routes/userRoutes');

// Add this with your other API routes
app.use('/api/users', userRoutes);

// Admin routes (web interface)
app.use('/admin', adminRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const jwt = require('jsonwebtoken');

// Authentication middleware
exports.authenticate = (req, res, next) => {
    // Check if this is an API request
    const isApiRequest = req.originalUrl.startsWith('/api/');
    
    // Get token from cookie or Authorization header
    const token = req.cookies.auth_token || 
                 (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    
    // Check if user is already in session
    if (req.session && req.session.user) {
        req.user = req.session.user;
        return next();
    }
    
    // If no token, redirect to login or return 401 for API
    if (!token) {
        if (isApiRequest) {
            return res.status(401).json({ error: 'Unauthorized - No token provided' });
        }
        return res.redirect('/admin/login');
    }
    
    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        req.user = decoded;
        
        // Set user in session if session exists
        if (req.session) {
            req.session.user = decoded;
        }
        
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        
        if (isApiRequest) {
            return res.status(401).json({ error: 'Unauthorized - Invalid token' });
        }
        res.redirect('/admin/login');
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        // Check if this is an API request
        const isApiRequest = req.originalUrl.startsWith('/api/');
        
        if (!req.user) {
            if (isApiRequest) {
                return res.status(401).json({ error: 'Unauthorized - Not authenticated' });
            }
            return res.redirect('/admin/login');
        }
        
        if (!roles.includes(req.user.role)) {
            if (isApiRequest) {
                return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
            }
            return res.status(403).render('admin/error', { 
                message: 'Bạn không có quyền truy cập trang này',
                user: req.user
            });
        }
        
        next();
    };
};
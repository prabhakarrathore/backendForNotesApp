const allowedOrigin = require('../config/allowedOrigin');

const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigin.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true);
    }
    // Set Cache-Control header
    res.header('Cache-Control', 'no-store'); // Adjust the value as needed
    // Set X-Content-Type-Options header
    res.header('X-Content-Type-Options', 'nosniff');
    next();
};

module.exports = credentials;
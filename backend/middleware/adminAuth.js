const jwt = require('jsonwebtoken');
const jetSecret = process.env.JWT_ADMIN_SECRET;


const adminAuth = (req, res, next) => {
    const token = req.header('x-access-token');
    if (!token) return res.status(401).send('Access denied. No token provided');
    try {
        const decoded = jwt.verify(token, jetSecret);
        req.admin = decoded;
        next();
    } catch (ex) {
        res.status(400).send('Invalid token.');
    }
}

module.exports = adminAuth;
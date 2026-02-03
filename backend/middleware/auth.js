const userModel = require('../models/user');
const jwt = require('jsonwebtoken');

const authentication =async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        console.log(token);
        let decoded = jwt.verify(token, 'secretKey');
        console.log(decoded);
        
        const user = await userModel.findByPk(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        req.user = user;
        console.log('Authenticated user:', req.user);
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }

};

module.exports = authentication;

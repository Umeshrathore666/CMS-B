import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ${token}','');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            throw new Error();
        }

        req.userId = user._id;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized' });
    }
};

export default authMiddleware;

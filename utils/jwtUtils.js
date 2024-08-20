// Backend/utils/jwtUtils.js

import jwt from 'jsonwebtoken';

// Function to generate a JWT token
export const generateToken = (userId) => {
  try {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  } catch (error) {
    throw new Error('Error generating token', error);
  }
};

// Function to verify a JWT token
export const verifyToken = async (token) => {
  try {
    return await jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Error verifying token', error);
  }
};

// Middleware to authenticate JWT token
export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token required' });
  }

  try {
    const decoded = await verifyToken(token);
    req.user = decoded; // Set user data to request object
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token', error });
  }
};
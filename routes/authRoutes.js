import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
        });

        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        return res.status(201).json({ token });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});

// Login a user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password.' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        return res.status(200).json({ 
            token,  
            message: 'Login successful.', 
            user: { 
                name: user.name,
                id: user._id, 
                email: user.email 
            } 
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});

// Logout a user
router.post('/logout', async (req, res) => {
  try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
          console.log('Authorization header is missing or incorrect:', req.header);
          return res.status(401).json({ message: 'Unauthorized' });
      }

      const token = authHeader.split(' ')[1];
      
      if (!token) {
          console.log('Token is missing after split:', token);
          return res.status(401).json({ message: 'Unauthorized' });
      }

      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
          if (err) {
              console.log('Token verification failed:', err);
              return res.status(401).json({ message: 'Invalid token' });
          }

          // Destroy the session
          req.session.destroy(err => {
              if (err) {
                  console.log('Session destruction failed:', err);
                  return res.status(500).json({ message: 'Failed to log out' });
              }
              console.log('User logged out successfully');
              return res.json({ message: 'Logged out successfully' });
          });
      });
  } catch (error) {
      console.log('Server error:', error);
      return res.status(500).json({ message: 'Server error' });
  }
});

export default router;

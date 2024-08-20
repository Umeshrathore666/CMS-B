// Backend/server.js

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import { authenticateToken } from './utils/jwtUtils.js';
 


// Load environment variables
dotenv.config();

// Create an Express app
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', authenticateToken, postRoutes); // Protect post routes with authentication
app.use('/api/media', authenticateToken, mediaRoutes); // Protect media routes with authentication

// Connect to MongoDB
const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        process.exit(1);
    }
};

connectToDatabase();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

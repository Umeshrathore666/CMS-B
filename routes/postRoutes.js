// Backend/src/routes/postRoutes.js
import express from 'express';
import { createPost, getPosts, getPostById, updatePost, deletePost } from '../controllers/postController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = express.Router();

// Route to create a new post
router.post('/create', authenticateToken, createPost);

// Route to get all posts
router.get('/', getPosts);

// Route to get a specific post by ID
router.get('/:id', getPostById);

// Route to update a post
router.put('/:id', authenticateToken, updatePost);

// Route to delete a post
router.delete('/:id', authenticateToken, deletePost);

export default router;

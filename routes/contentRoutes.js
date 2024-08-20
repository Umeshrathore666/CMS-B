import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import Post from '../models/Post.js';

const router = express.Router();

// Create a new post
router.post('/create-post', authMiddleware, async (req, res) => {
    const { title, content, isPublished, scheduledDate } = req.body;

    try {
        const post = new Post({
            title,
            content,
            author: req.userId,
            isPublished: isPublished || false,
            scheduledDate: scheduledDate || null,
        });

        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all posts
router.get('/posts', authMiddleware, async (req, res) => {
    try {
        const posts = await Post.find({ author: req.userId });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a single post by ID
router.get('/posts/:id', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post || post.author.toString() !== req.userId) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Edit a post by ID
router.put('/posts/:id', authMiddleware, async (req, res) => {
    const { title, content, isPublished, scheduledDate } = req.body;

    try {
        let post = await Post.findById(req.params.id);
        if (!post || post.author.toString() !== req.userId) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.title = title;
        post.content = content;
        post.isPublished = isPublished;
        post.scheduledDate = scheduledDate;

        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a post by ID
router.delete('/posts/:id', authMiddleware, async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        if (!post || post.author.toString() !== req.userId) {
            return res.status(404).json({ message: 'Post not found' });
        }

        await post.remove();
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;

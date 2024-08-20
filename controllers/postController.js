// Backend/controllers/postController.js

import Post from '../models/Post.js';

// Create a new post
export const createPost = async (req, res) => {
    const { title, content, media } = req.body;

    try {
        const post = new Post({
            title,
            content,
            media,
            user: req.user.userId // Assuming you have user info in req.user
        });

        await post.save();
        res.status(201).json({ message: 'Post created successfully', post });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all posts
export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find({ user: req.user.userId });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get a single post by ID
export const getPostById = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findById(id);

        if (!post) return res.status(404).json({ message: 'Post not found' });

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update a post by ID
export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, content, media } = req.body;

    try {
        const post = await Post.findByIdAndUpdate(id, { title, content, media }, { new: true });

        if (!post) return res.status(404).json({ message: 'Post not found' });

        res.status(200).json({ message: 'Post updated successfully', post });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete a post by ID
export const deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findById(id);

        if (!post) return res.status(404).json({ message: 'Post not found' });

        await post.remove();
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Backend/controllers/mediaController.js

import Media from '../models/Media.js';
import path from 'path';
import fs from 'fs';
import multer from 'multer';

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Upload media file
export const uploadMedia = [upload.single('media'), async (req, res) => {
    try {
        const media = new Media({
            filename: req.file.filename,
            path: req.file.path,
            user: req.user.userId // Assuming you have user info in req.user
        });

        await media.save();
        res.status(201).json({ message: 'Media uploaded successfully', media });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}];

// Get all media files
export const getMediaLibrary = async (req, res) => {
    try {
        const media = await Media.find({ user: req.user.userId });
        res.status(200).json(media);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete media file
export const deleteMedia = async (req, res) => {
    const { id } = req.params;

    try {
        const media = await Media.findById(id);

        if (!media) return res.status(404).json({ message: 'Media not found' });

        fs.unlinkSync(media.path); // Delete file from the server
        await media.remove();
        res.status(200).json({ message: 'Media deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

import express from 'express';
import multer from 'multer';
import authMiddleware from '../middleware/authMiddleware.js';
import Media from '../models/Media.js';
import path from 'path';

const router = express.Router();

// Set up multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Upload media
router.post('/upload-media', authMiddleware, upload.single('file'), async (req, res) => {
    try {
        const media = new Media({
            filename: req.file.filename,
            filePath: req.file.path,
            author: req.userId,
        });

        await media.save();
        res.status(201).json(media);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all media files
router.get('/media-library', authMiddleware, async (req, res) => {
    try {
        const mediaFiles = await Media.find({ author: req.userId });
        res.json(mediaFiles);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a single media file by ID
router.get('/media-library/:id', authMiddleware, async (req, res) => {
    try {
        const media = await Media.findById(req.params.id);
        if (!media || media.author.toString() !== req.userId) {
            return res.status(404).json({ message: 'Media file not found' });
        }

        res.sendFile(path.resolve(media.filePath));
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a media file by ID
router.delete('/media-library/:id', authMiddleware, async (req, res) => {
    try {
        const media = await Media.findById(req.params.id);
        if (!media || media.author.toString() !== req.userId) {
            return res.status(404).json({ message: 'Media file not found' });
        }

        await media.remove();
        res.json({ message: 'Media file deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;

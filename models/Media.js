import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
    },
    filePath: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Media', mediaSchema);

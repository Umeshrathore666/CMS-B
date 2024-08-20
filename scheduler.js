import fs from 'fs';
import path from 'path';

const createUploadsDirectory = () => {
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
    }
};

createUploadsDirectory();

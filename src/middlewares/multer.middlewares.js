import multer from "multer"
import path from 'path';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

// Get the file URL of the current module
const __filename = fileURLToPath(import.meta.url);
// Get the current directory
const __dirname = dirname(__filename);
// Get the parent directory
const parentDir = resolve(__dirname, '..');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `${parentDir}/upload`); // Save to the 'upload' folder
    },
    filename: (req, file, cb) => {
      // Extract the original file extension
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName); // Save with a unique name and original extension
    }
  });

export const upload=multer({storage,})
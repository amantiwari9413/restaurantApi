import multer from "multer"
import path from 'path';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public'); // Save to the 'upload' folder
    },
    filename: (req, file, cb) => {
      // Extract the original file extension
      const ext = path.extname(file.originalname);
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName); // Save with a unique name and original extension
    }
  });

export const upload=multer({storage,})

import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.txt' && ext !== '.docx') {
      return cb(new Error('Only .txt and .docx files are allowed'), false);
    }
    cb(null, true);
  },
});

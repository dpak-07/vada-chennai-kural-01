import busboy from 'busboy';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Define the uploads directory path (external to backend folder)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.join(__dirname, '../../../uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

/**
 * Middleware template using Busboy for handling file uploads.
 * This parses incoming multipart/form-data and saves files to the external uploads directory.
 */
export const uploadMiddleware = (req, res, next) => {
  if (req.method !== 'POST' && req.method !== 'PUT') {
    return next();
  }

  const contentType = req.headers['content-type'] || '';
  if (!contentType.includes('multipart/form-data')) {
    return next();
  }

  const bb = busboy({ headers: req.headers });
  req.files = [];
  req.body = {};

  bb.on('file', (name, file, info) => {
    const { filename, encoding, mimeType } = info;
    
    // Create a unique file name to avoid overwrite
    const uniqueFilename = `${Date.now()}-${filename}`;
    const saveTo = path.join(UPLOAD_DIR, uniqueFilename);
    
    const writeStream = fs.createWriteStream(saveTo);
    file.pipe(writeStream);

    writeStream.on('close', () => {
      req.files.push({
        fieldName: name,
        originalName: filename,
        filename: uniqueFilename,
        path: saveTo,
        encoding,
        mimeType,
      });
    });
  });

  bb.on('field', (name, val, info) => {
    req.body[name] = val;
  });

  bb.on('finish', () => {
    next();
  });

  bb.on('error', (err) => {
    next(err);
  });

  req.pipe(bb);
};

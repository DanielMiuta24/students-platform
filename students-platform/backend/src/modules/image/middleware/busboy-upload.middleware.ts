import type { Response, NextFunction } from 'express';
import Busboy from 'busboy';
import { Readable } from 'stream';
import type { UploadedFile, UploadRequest } from '../services/image.types';
import { IMAGE_VALIDATION } from '../services/image.constants';

export interface BusboyUploadOptions {
  maxFiles?: number;
  maxFileSize?: number;
  allowedMimeTypes?: string[];
  filesRequired?: boolean;
}

export const busboyUploadMiddleware = (options?: BusboyUploadOptions) => {
  const maxFiles = options?.maxFiles ?? IMAGE_VALIDATION.MAX_FILES_PER_REQUEST;
  const maxFileSize = options?.maxFileSize ?? IMAGE_VALIDATION.MAX_FILE_SIZE;
  const allowedMimeTypes = options?.allowedMimeTypes ?? IMAGE_VALIDATION.ALLOWED_MIME_TYPES;
  const filesRequired = options?.filesRequired ?? false;

  return (req: UploadRequest, res: Response, next: NextFunction): void => {
    const contentType = req.headers['content-type'];

    if (!contentType || !contentType.includes('multipart/form-data')) {
      next();
      return;
    }

    const files: UploadedFile[] = [];
    const body: Record<string, any> = {};
    let fileCount = 0;
    let hasError = false;

    const busboy = Busboy({
      headers: req.headers,
      limits: {
        files: maxFiles,
        fileSize: maxFileSize,
      },
    });

    busboy.on('field', (fieldname: string, value: string) => {
      if (hasError) return;

      try {
        body[fieldname] = JSON.parse(value);
      } catch {
        body[fieldname] = value;
      }
    });

    busboy.on('file', (fieldname: string, file: Readable, info: { filename: string; encoding: string; mimeType: string }) => {
      if (hasError) {
        file.resume();
        return;
      }

      fileCount++;

      if (fileCount > maxFiles) {
        hasError = true;
        file.resume();
        busboy.removeAllListeners();
        res.status(400).json({ message: `Maximum ${maxFiles} files allowed` });
        return;
      }

      if (!allowedMimeTypes.includes(info.mimeType as any)) {
        hasError = true;
        file.resume();
        busboy.removeAllListeners();
        res.status(400).json({
          message: `Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`
        });
        return;
      }

      const chunks: Buffer[] = [];
      let fileSize = 0;

      file.on('data', (chunk: Buffer) => {
        if (hasError) return;

        fileSize += chunk.length;

        if (fileSize > maxFileSize) {
          hasError = true;
          file.resume();
          busboy.removeAllListeners();
          res.status(400).json({
            message: `File too large. Maximum size: ${maxFileSize / (1024 * 1024)}MB`
          });
          return;
        }

        chunks.push(chunk);
      });

      file.on('end', () => {
        if (hasError) return;

        const buffer = Buffer.concat(chunks);
        const stream = Readable.from(buffer);

        files.push({
          fieldname,
          originalname: info.filename,
          encoding: info.encoding,
          mimetype: info.mimeType,
          size: fileSize,
          stream,
        });
      });

      file.on('error', (err: Error) => {
        if (hasError) return;
        hasError = true;
        busboy.removeAllListeners();
        next(err);
      });
    });

    busboy.on('finish', () => {
      if (hasError) return;

      if (filesRequired && files.length === 0) {
        res.status(400).json({ message: 'No files provided' });
        return;
      }

      req.body = body;
      req.files = files;
      next();
    });

    busboy.on('error', (err: Error) => {
      if (hasError) return;
      hasError = true;
      next(err);
    });

    req.pipe(busboy);
  };
};

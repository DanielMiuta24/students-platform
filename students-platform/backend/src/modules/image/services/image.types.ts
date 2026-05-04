import type { Readable } from 'stream';
import type { Request } from 'express';

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  stream: Readable;
}

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  size: number;
}

export interface CloudinaryUploadOptions {
  folder: string;
  transformation?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
    format?: string;
  };
  tags?: string[];
  context?: Record<string, string>;
}

export interface UploadImagesResponse {
  images: UploadResult[];
  message: string;
}

export interface UploadRequest extends Request {
  files?: UploadedFile[];
}

export const IMAGE_VALIDATION = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_FILES_PER_REQUEST: 8,
  ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
  MIN_WIDTH: 100,
  MIN_HEIGHT: 100,
  MAX_WIDTH: 4096,
  MAX_HEIGHT: 4096,
} as const;

export const IMAGE_ERROR = {
  NO_FILES: 'NO_FILES_PROVIDED',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  TOO_MANY_FILES: 'TOO_MANY_FILES',
  UPLOAD_FAILED: 'UPLOAD_FAILED',
  CLOUDINARY_ERROR: 'CLOUDINARY_ERROR',
  INVALID_DIMENSIONS: 'INVALID_DIMENSIONS',
  INVALID_CONTENT_TYPE: 'INVALID_CONTENT_TYPE',
} as const;

export const CLOUDINARY_FOLDERS = {
  POST_IMAGES: 'posts',
  USER_AVATARS: 'avatars',
  TEMP: 'temp',
} as const;

export const IMAGE_TRANSFORMATION_PRESETS = {
  POST_IMAGE: {
    width: 1200,
    height: 1200,
    crop: 'limit',
    quality: 'auto',
    format: 'webp',
  },
  AVATAR: {
    width: 400,
    height: 400,
    crop: 'fill',
    quality: 'auto',
    format: 'webp',
  },
} as const;

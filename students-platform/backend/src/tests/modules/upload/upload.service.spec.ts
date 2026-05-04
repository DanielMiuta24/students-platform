import { imageService } from '../../../modules/image/services/image.service';
import { CloudinaryUploadOptionsBuilder } from '../../../modules/image/services/cloudinary-upload-options.builder';
import { Readable, Writable } from 'stream';
import type { UploadedFile } from '../../../modules/image/services/image.types';
import { cloudinary } from '../../../config/cloudinary.config';

jest.mock('../../../config/cloudinary.config', () => ({
  cloudinary: {
    uploader: {
      upload_stream: jest.fn(),
      destroy: jest.fn(),
    },
  },
}));

describe('UploadService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadImage', () => {
    it('should upload image successfully', async () => {
      const mockFile: UploadedFile = {
        fieldname: 'file',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 1024,
        stream: Readable.from(Buffer.from('test')),
      };

      const mockCloudinaryResult = {
        secure_url: 'https://res.cloudinary.com/test/image.jpg',
        public_id: 'posts/test123',
        width: 800,
        height: 600,
        format: 'jpg',
        bytes: 1024,
      };

      const mockWritableStream = new Writable({
        write(chunk, encoding, callback) {
          callback();
        },
      });

      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
        (options: any, callback: any) => {
          setImmediate(() => callback(null, mockCloudinaryResult));
          return mockWritableStream;
        }
      );

      const options = new CloudinaryUploadOptionsBuilder()
        .withPostImageDefaults()
        .build();

      const result = await imageService.uploadImage(mockFile, options);

      expect(result).toEqual({
        url: mockCloudinaryResult.secure_url,
        publicId: mockCloudinaryResult.public_id,
        width: mockCloudinaryResult.width,
        height: mockCloudinaryResult.height,
        format: mockCloudinaryResult.format,
        size: mockCloudinaryResult.bytes,
      });

      expect(cloudinary.uploader.upload_stream).toHaveBeenCalledWith(
        expect.objectContaining({
          folder: 'posts',
          transformation: expect.any(Object),
          tags: ['post', 'user-upload'],
          resource_type: 'image',
        }),
        expect.any(Function)
      );
    });

    it('should handle Cloudinary errors', async () => {
      const mockFile: UploadedFile = {
        fieldname: 'file',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 1024,
        stream: Readable.from(Buffer.from('test')),
      };

      const mockWritableStream = new Writable({
        write(chunk, encoding, callback) {
          callback();
        },
      });

      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
        (options: any, callback: any) => {
          setImmediate(() => callback(new Error('Cloudinary error'), null));
          return mockWritableStream;
        }
      );

      const options = new CloudinaryUploadOptionsBuilder()
        .withPostImageDefaults()
        .build();

      await expect(imageService.uploadImage(mockFile, options)).rejects.toThrow(
        'CLOUDINARY_ERROR'
      );
    });
  });

  describe('uploadImages', () => {
    it('should upload multiple images successfully', async () => {
      const mockFiles: UploadedFile[] = [
        {
          fieldname: 'file',
          originalname: 'test1.jpg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          size: 1024,
          stream: Readable.from(Buffer.from('test1')),
        },
        {
          fieldname: 'file',
          originalname: 'test2.jpg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          size: 2048,
          stream: Readable.from(Buffer.from('test2')),
        },
      ];

      const mockCloudinaryResult = {
        secure_url: 'https://res.cloudinary.com/test/image.jpg',
        public_id: 'posts/test123',
        width: 800,
        height: 600,
        format: 'jpg',
        bytes: 1024,
      };

      const mockWritableStream = new Writable({
        write(chunk, encoding, callback) {
          callback();
        },
      });

      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
        (options: any, callback: any) => {
          setImmediate(() => callback(null, mockCloudinaryResult));
          return mockWritableStream;
        }
      );

      const options = new CloudinaryUploadOptionsBuilder()
        .withPostImageDefaults()
        .build();

      const results = await imageService.uploadImages(mockFiles, options);

      expect(results).toHaveLength(2);
      expect(results[0].url).toBe(mockCloudinaryResult.secure_url);
      expect(cloudinary.uploader.upload_stream).toHaveBeenCalledTimes(2);
    });
  });

  describe('deleteImage', () => {
    it('should delete image successfully', async () => {
      (cloudinary.uploader.destroy as jest.Mock).mockResolvedValue({ result: 'ok' });

      await imageService.deleteImage('posts/test123');

      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('posts/test123');
    });

    it('should handle deletion errors', async () => {
      (cloudinary.uploader.destroy as jest.Mock).mockRejectedValue(
        new Error('Deletion failed')
      );

      await expect(imageService.deleteImage('posts/test123')).rejects.toThrow(
        'CLOUDINARY_ERROR'
      );
    });
  });
});

describe('CloudinaryUploadOptionsBuilder', () => {
  it('should build options with post image defaults', () => {
    const options = new CloudinaryUploadOptionsBuilder()
      .withPostImageDefaults()
      .build();

    expect(options).toEqual({
      folder: 'posts',
      transformation: {
        width: 1200,
        height: 1200,
        crop: 'limit',
        quality: 'auto',
        format: 'webp',
      },
      tags: ['post', 'user-upload'],
    });
  });

  it('should build options with avatar defaults', () => {
    const options = new CloudinaryUploadOptionsBuilder()
      .withAvatarDefaults()
      .build();

    expect(options).toEqual({
      folder: 'avatars',
      transformation: {
        width: 400,
        height: 400,
        crop: 'fill',
        quality: 'auto',
        format: 'webp',
      },
      tags: ['avatar', 'user-upload'],
    });
  });

  it('should allow custom configuration', () => {
    const options = new CloudinaryUploadOptionsBuilder()
      .setFolder('custom-folder')
      .setTags(['custom-tag'])
      .setTransformation({ width: 500, height: 500 })
      .build();

    expect(options).toEqual({
      folder: 'custom-folder',
      tags: ['custom-tag'],
      transformation: { width: 500, height: 500 },
    });
  });
});

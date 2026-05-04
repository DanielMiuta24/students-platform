import { cloudinary } from '../../../config/cloudinary.config';
import type { UploadedFile, UploadResult, CloudinaryUploadOptions } from './image.types';
import { IMAGE_ERROR } from './image.constants';
import { CloudinaryUploadOptionsBuilder } from '../builders';
import { ImageModel } from '../image.model';
import { ImageCreateBuilder } from '../builders';

export class ImageService {
  async uploadImage(
    file: UploadedFile,
    options: CloudinaryUploadOptions
  ): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: options.folder,
          transformation: options.transformation,
          tags: options.tags,
          context: options.context,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) {
            reject(new Error(IMAGE_ERROR.CLOUDINARY_ERROR));
            return;
          }

          if (!result) {
            reject(new Error(IMAGE_ERROR.UPLOAD_FAILED));
            return;
          }

          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            size: result.bytes,
          });
        }
      );

      file.stream.pipe(uploadStream);

      file.stream.on('error', (error) => {
        reject(new Error(IMAGE_ERROR.UPLOAD_FAILED));
      });
    });
  }

  async uploadImages(
    files: UploadedFile[],
    options: CloudinaryUploadOptions
  ): Promise<UploadResult[]> {
    const uploadPromises = files.map((file) => this.uploadImage(file, options));
    return Promise.all(uploadPromises);
  }

  async uploadImagesForPost(files: UploadedFile[], userId: string): Promise<UploadResult[]> {
    const options = new CloudinaryUploadOptionsBuilder()
      .withPostImageDefaults()
      .build();
    const uploadedImages = await this.uploadImages(files, options);

    const imageDocs = uploadedImages.map(upload =>
      new ImageModel(
        new ImageCreateBuilder()
          .fromUploadResult(userId, upload, 'posts')
          .build()
      )
    );
    await ImageModel.insertMany(imageDocs);

    return uploadedImages;
  }

  async uploadImageForAvatar(file: UploadedFile): Promise<UploadResult> {
    const options = new CloudinaryUploadOptionsBuilder()
      .withAvatarDefaults()
      .build();
    return this.uploadImage(file, options);
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new Error(IMAGE_ERROR.CLOUDINARY_ERROR);
    }
  }

  async validateImagesOwnership(urls: string[], userId: string): Promise<boolean> {
    const count = await ImageModel.countDocuments({
      url: { $in: urls },
      owner: userId,
    });
    return count === urls.length;
  }
}

export const imageService = new ImageService();

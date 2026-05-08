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
            console.error('Cloudinary upload error:', error);
            reject(new Error(`${IMAGE_ERROR.CLOUDINARY_ERROR}: ${error.message || 'Unknown error'}`));
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
        console.error('File stream error:', error);
        reject(new Error(`${IMAGE_ERROR.UPLOAD_FAILED}: ${error.message || 'Stream error'}`));
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

  async uploadImagesForPost(files: UploadedFile[], userId: string): Promise<Array<UploadResult & { imageId: string }>> {
    const options = new CloudinaryUploadOptionsBuilder()
      .withPostImageDefaults()
      .build();
    const uploadedImages = await this.uploadImages(files, options);

    const imageData = uploadedImages.map(upload =>
      new ImageCreateBuilder()
        .fromUploadResult(userId, upload, 'posts')
        .build()
    );
    const savedDocs = await ImageModel.insertMany(imageData);

    return uploadedImages.map((upload, index) => ({
      ...upload,
      imageId: savedDocs[index]._id.toString()
    }));
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
    } catch (error: any) {
      console.error('Cloudinary delete error:', error);
      throw new Error(`${IMAGE_ERROR.CLOUDINARY_ERROR}: ${error.message || 'Delete failed'}`);
    }
  }

  async deleteImageFromDb(imageId: string): Promise<void> {
    await ImageModel.findByIdAndDelete(imageId);
  }

  async validateImagesOwnership(urls: string[], userId: string): Promise<boolean> {
    const count = await ImageModel.countDocuments({
      url: { $in: urls },
      owner: userId,
    });
    return count === urls.length;
  }

  async getImageIdsByUrls(urls: string[]): Promise<string[]> {
    const images = await ImageModel.find({ url: { $in: urls } }).select('_id url').exec();
    const urlToIdMap = new Map(images.map(img => [img.url, img._id.toString()]));
    return urls.map(url => urlToIdMap.get(url)!).filter(Boolean);
  }
}

export const imageService = new ImageService();

import { ImageModel, type ImageDoc } from './image.model';
import { ImageCreateBuilder } from './builders';

export class ImageService {
  async createImagesFromUploads(
    ownerId: string,
    uploads: Array<{
      url: string;
      publicId: string;
      width: number;
      height: number;
      format: string;
      size: number;
    }>,
    folder: string
  ): Promise<ImageDoc[]> {
    const imageDocs = uploads.map(upload =>
      new ImageModel(
        new ImageCreateBuilder()
          .fromUploadResult(ownerId, upload, folder)
          .build()
      )
    );

    return ImageModel.insertMany(imageDocs);
  }

  async validateImagesOwnership(urls: string[], ownerId: string): Promise<boolean> {
    const count = await ImageModel.countDocuments({
      url: { $in: urls },
      owner: ownerId,
    });
    return count === urls.length;
  }
}

export const imageService = new ImageService();

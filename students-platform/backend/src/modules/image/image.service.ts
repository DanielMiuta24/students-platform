import { ImageModel, type ImageDoc } from './image.model';

export class ImageService {
  async createImage(
    ownerId: string,
    url: string,
    publicId: string,
    width: number,
    height: number,
    format: string,
    size: number,
    folder: string
  ): Promise<ImageDoc> {
    const image = new ImageModel({
      owner: ownerId,
      url,
      publicId,
      width,
      height,
      format,
      size,
      folder,
    });
    return image.save();
  }

  async createImages(
    ownerId: string,
    images: Array<{
      url: string;
      publicId: string;
      width: number;
      height: number;
      format: string;
      size: number;
      folder: string;
    }>
  ): Promise<ImageDoc[]> {
    const imagePromises = images.map((img) =>
      this.createImage(
        ownerId,
        img.url,
        img.publicId,
        img.width,
        img.height,
        img.format,
        img.size,
        img.folder
      )
    );
    return Promise.all(imagePromises);
  }

  async validateImageOwnership(url: string, ownerId: string): Promise<boolean> {
    const image = await ImageModel.findOne({ url, owner: ownerId });
    return !!image;
  }

  async validateImagesOwnership(urls: string[], ownerId: string): Promise<boolean> {
    const count = await ImageModel.countDocuments({
      url: { $in: urls },
      owner: ownerId,
    });
    return count === urls.length;
  }

  async getUserImages(ownerId: string, limit: number = 50): Promise<ImageDoc[]> {
    return ImageModel.find({ owner: ownerId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async deleteImage(publicId: string, ownerId: string): Promise<boolean> {
    const result = await ImageModel.deleteOne({ publicId, owner: ownerId });
    return result.deletedCount > 0;
  }
}

export const imageService = new ImageService();

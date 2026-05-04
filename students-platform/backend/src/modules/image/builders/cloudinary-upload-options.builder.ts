import type { CloudinaryUploadOptions } from '../services/image.types';
import { CLOUDINARY_FOLDERS, IMAGE_TRANSFORMATION_PRESETS } from '../services/image.constants';

export class CloudinaryUploadOptionsBuilder {
  private options: CloudinaryUploadOptions = {
    folder: CLOUDINARY_FOLDERS.TEMP,
  };

  setFolder(folder: string): this {
    this.options.folder = folder;
    return this;
  }

  setTransformation(transformation: CloudinaryUploadOptions['transformation']): this {
    this.options.transformation = transformation;
    return this;
  }

  setTags(tags: string[]): this {
    this.options.tags = tags;
    return this;
  }

  setContext(context: Record<string, string>): this {
    this.options.context = context;
    return this;
  }

  withPostImageDefaults(): this {
    return this
      .setFolder(CLOUDINARY_FOLDERS.POST_IMAGES)
      .setTransformation(IMAGE_TRANSFORMATION_PRESETS.POST_IMAGE)
      .setTags(['post', 'user-upload']);
  }

  withAvatarDefaults(): this {
    return this
      .setFolder(CLOUDINARY_FOLDERS.USER_AVATARS)
      .setTransformation(IMAGE_TRANSFORMATION_PRESETS.AVATAR)
      .setTags(['avatar', 'user-upload']);
  }

  build(): CloudinaryUploadOptions {
    return { ...this.options };
  }
}

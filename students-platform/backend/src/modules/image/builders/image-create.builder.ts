export class ImageCreateBuilder {
  private data: {
    owner?: string;
    url?: string;
    publicId?: string;
    width?: number;
    height?: number;
    format?: string;
    size?: number;
    folder?: string;
  } = {};

  setOwner(owner: string): this {
    this.data.owner = owner;
    return this;
  }

  setUrl(url: string): this {
    this.data.url = url;
    return this;
  }

  setPublicId(publicId: string): this {
    this.data.publicId = publicId;
    return this;
  }

  setWidth(width: number): this {
    this.data.width = width;
    return this;
  }

  setHeight(height: number): this {
    this.data.height = height;
    return this;
  }

  setFormat(format: string): this {
    this.data.format = format;
    return this;
  }

  setSize(size: number): this {
    this.data.size = size;
    return this;
  }

  setFolder(folder: string): this {
    this.data.folder = folder;
    return this;
  }

  fromUploadResult(
    owner: string,
    uploadResult: {
      url: string;
      publicId: string;
      width: number;
      height: number;
      format: string;
      size: number;
    },
    folder: string
  ): this {
    return this.setOwner(owner)
      .setUrl(uploadResult.url)
      .setPublicId(uploadResult.publicId)
      .setWidth(uploadResult.width)
      .setHeight(uploadResult.height)
      .setFormat(uploadResult.format)
      .setSize(uploadResult.size)
      .setFolder(folder);
  }

  build() {
    return this.data;
  }
}

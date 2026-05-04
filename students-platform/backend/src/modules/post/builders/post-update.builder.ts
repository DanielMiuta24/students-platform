import type { UpdatePostDTO } from '../types/post.types';
import type { PostStatus, PostVisibility } from '../../../shared/constants';
import type { PostContent } from '../types/post-content.types';
import { toSlug } from '../../../shared/utils/slug';

/**
 * Builder pattern for constructing post update data
 * Only includes fields that are provided (for proper updates)
 */
export class PostUpdateBuilder {
  private data: any = {};

  setTitle(title: string): this {
    this.data.title = title.trim();
    return this;
  }

  setSlug(title: string): this {
    this.data.slug = toSlug(title.substring(0, 100)) + '-' + Date.now();
    return this;
  }

  setContent(content: PostContent): this {
    this.data.content = content;
    return this;
  }

  setCategory(categoryId?: string | null): this {
    this.data.category = categoryId;
    return this;
  }

  setStatus(status: PostStatus): this {
    this.data.status = status;
    return this;
  }

  setVisibility(visibility?: PostVisibility): this {
    if (visibility !== undefined) {
      this.data.visibility = visibility;
    }
    return this;
  }

  setImages(images?: Array<{ url: string; alt?: string; publicId?: string; storageKey?: string }>): this {
    if (images !== undefined) {
      this.data.images = images;
    }
    return this;
  }

  fromDTO(dto: UpdatePostDTO): this {
    this.setTitle(dto.title)
      .setSlug(dto.title)
      .setContent(dto.content)
      .setCategory(dto.category)
      .setStatus(dto.status)
      .setVisibility(dto.visibility)
      .setImages(dto.images);
    return this;
  }

  build(): any {
    return this.data;
  }
}

import type { CreatePostDTO } from '../post.types';
import type { PostStatus, PostVisibility } from '../../../shared/constants';
import type { PostContent } from '../post-content.types';
import { POST_STATUS, POST_VISIBILITY } from '../../../shared/constants';

/**
 * Builder pattern for constructing post creation data
 * Handles defaults and data normalization for new posts
 */
export class PostCreateBuilder {
  private data: any = {
    likeCount: 0,
    commentCount: 0,
    viewCount: 0,
  };

  setAuthor(authorId: string): this {
    this.data.author = authorId;
    return this;
  }

  setTitle(title: string): this {
    this.data.title = title.trim();
    return this;
  }

  setContent(content: PostContent): this {
    this.data.content = content;
    return this;
  }

  setCategory(categoryId?: string): this {
    this.data.category = categoryId || undefined;
    return this;
  }

  setStatus(status?: PostStatus): this {
    this.data.status = status || POST_STATUS.DRAFT;
    return this;
  }

  setVisibility(visibility?: PostVisibility): this {
    this.data.visibility = visibility || POST_VISIBILITY.PUBLIC;
    return this;
  }

  setImages(images?: Array<{ url: string; alt?: string; publicId?: string; storageKey?: string }>): this {
    this.data.images = images || [];
    return this;
  }

  fromDTO(dto: CreatePostDTO): this {
    return this
      .setAuthor(dto.authorId)
      .setTitle(dto.title)
      .setContent(dto.content)
      .setCategory(dto.category)
      .setStatus(dto.status)
      .setVisibility(dto.visibility)
      .setImages(dto.images);
  }

  build(): any {
    return this.data;
  }
}

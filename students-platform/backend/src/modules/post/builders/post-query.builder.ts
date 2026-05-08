import type { GetPostsDTO } from '../types/post.types';

/**
 * Builder pattern for constructing MongoDB query filters
 * Provides a fluent interface for building complex feed queries
 */
export class PostQueryBuilder {
  private query: any = {};

  setStatus(status: 'draft' | 'published' | 'archived'): this {
    this.query.status = status;
    return this;
  }

  setVisibility(visibility: 'public' | 'private' | 'friends'): this {
    this.query.visibility = visibility;
    return this;
  }

  setAuthor(authorId: string): this {
    this.query.author = authorId;
    return this;
  }

  setCategory(categoryId: string): this {
    this.query.category = categoryId;
    return this;
  }

  setCursor(cursor: string): this {
    this.query._id = { $lt: cursor };
    return this;
  }

  setPublicFeedDefaults(): this {
    this.query.status = 'published';
    this.query.visibility = 'public';
    return this;
  }

  setFeedVisibilityForUser(userId: string, friendIds: string[]): this {
    this.query.status = 'published';
    this.query.$or = [
      { visibility: 'public' },
      { visibility: 'friends', author: { $in: friendIds } },
      { author: userId }
    ];
    return this;
  }

  fromDTO(dto: GetPostsDTO): this {
    if (!dto.authorId) {
      this.setPublicFeedDefaults();
    } else {
      this.setAuthor(dto.authorId);
      if (dto.status) this.setStatus(dto.status);
      if (dto.visibility) this.setVisibility(dto.visibility);
    }

    if (dto.categoryId) {
      this.setCategory(dto.categoryId);
    }

    if (dto.cursor) {
      this.setCursor(dto.cursor);
    }

    return this;
  }

  build(): any {
    return this.query;
  }
}

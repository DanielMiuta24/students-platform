import type { GetPostsDTO } from '../types/post.types';

export class PostQueryBuilder {
  private query: any = {};

  setStatus(status: 'draft' | 'published' | 'archived'): this {
    this.query.status = status;
    return this;
  }

  setVisibility(visibility: 'public' | 'private' | 'friends' | 'community'): this {
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

  setCommunity(communityId: string): this {
    this.query.community = communityId;
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

  setCommunityFeedDefaults(communityId: string): this {
    this.query.community = communityId;
    this.query.status = 'published';
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

  setFeedVisibilityForUserWithCommunities(userId: string, friendIds: string[], communityIds: string[]): this {
    this.query.status = 'published';
    this.query.$or = [
      { visibility: 'public', community: null },
      { visibility: 'friends', author: { $in: friendIds }, community: null },
      { author: userId, community: null },
      { community: { $in: communityIds } }
    ];
    return this;
  }

  setAuthorFeedVisibility(authorId: string, viewerId: string): this {
    this.query.author = authorId;
    this.query.status = 'published';

    if (viewerId === authorId) {
      return this;
    }

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

    if (dto.communityId) {
      this.setCommunity(dto.communityId);
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

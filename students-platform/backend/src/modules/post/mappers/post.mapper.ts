import type { PostDoc } from '../models/post.model';
import type { SafePost, ImageMetadata, SafeAuthor, SafeCommunity } from '../types/post.types';
import type { PostContent } from '../types/post-content.types';
import type { ImageDoc } from '../../image/image.model';

export class PostMapper {
  static toSafePost(post: PostDoc): SafePost {
    return {
      id: this.extractId(post._id),
      author: this.mapAuthor(post.author),
      title: post.title,
      slug: post.slug,
      content: post.content as PostContent,
      category: post.category ? this.extractId(post.category) : undefined,
      community: post.community ? this.mapCommunity(post.community) : undefined,
      status: post.status,
      visibility: post.visibility,
      images: this.mapImages(post.images),
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      viewCount: post.viewCount,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  static toSafePosts(posts: PostDoc[]): SafePost[] {
    return posts.map(post => this.toSafePost(post));
  }

  private static mapAuthor(value: any): string | SafeAuthor {
    if (!value) return '';
    if (typeof value === 'string') return value;

    // Check if author is populated with user data
    if (value._id && (value.name || value.username)) {
      return {
        id: value._id.toString(),
        name: value.name || '',
        username: value.username || '',
        email: value.email || '',
        avatar: value.avatar || '',
        type: value.type || '',
      };
    }

    // Just an ObjectId
    if (value._id) return value._id.toString();
    if (typeof value.toString === 'function' && value.constructor.name === 'ObjectId') {
      return value.toString();
    }

    return '';
  }

  /**
   * Extracts string ID from ObjectId or populated document
   */
  private static extractId(value: any): string {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (value._id) return value._id.toString();
    if (typeof value.toString === 'function' && value.constructor.name === 'ObjectId') {
      return value.toString();
    }
    return '';
  }

  private static mapCommunity(value: any): string | SafeCommunity {
    if (!value) return '';
    if (typeof value === 'string') return value;

    // Check if community is populated with community data
    if (value._id && value.name) {
      return {
        id: value._id.toString(),
        name: value.name,
        slug: value.slug || '',
        coverImage: this.extractImageUrl(value.coverImage),
        visibility: value.visibility,
      };
    }

    // Just an ObjectId
    if (value._id) return value._id.toString();
    if (typeof value.toString === 'function' && value.constructor.name === 'ObjectId') {
      return value.toString();
    }

    return '';
  }

  private static extractImageUrl(image: any): string | undefined {
    if (!image) return undefined;
    if (typeof image === 'string') return image;
    if (image.url) return image.url;
    return undefined;
  }

  private static mapImages(images: any[]): ImageMetadata[] {
    if (!images || images.length === 0) return [];

    return images.map(img => {
      if (typeof img === 'object' && img.url) {
        return {
          url: img.url,
          publicId: img.publicId,
        };
      }
      return { url: '', publicId: '' };
    }).filter(img => img.url !== '');
  }
}

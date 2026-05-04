import type { PostDoc } from '../models/post.model';
import type { SafePost } from '../types/post.types';
import type { PostContent } from '../types/post-content.types';

/**
 * Mapper for converting PostDoc to SafePost (API response format)
 * Handles data transformation and serialization
 */
export class PostMapper {
  /**
   * Converts PostDoc to safe API response format
   */
  static toSafePost(post: PostDoc): SafePost {
    return {
      id: this.extractId(post._id),
      author: this.extractId(post.author),
      title: post.title,
      content: post.content as PostContent,
      category: post.category ? this.extractId(post.category) : undefined,
      status: post.status,
      visibility: post.visibility,
      images: post.images || [],
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      viewCount: post.viewCount,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  /**
   * Converts array of PostDocs to SafePosts
   */
  static toSafePosts(posts: PostDoc[]): SafePost[] {
    return posts.map(post => this.toSafePost(post));
  }

  /**
   * Extracts string ID from ObjectId or populated document
   */
  private static extractId(value: any): string {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (value.toString) return value.toString();
    if (value._id) return value._id.toString();
    return '';
  }
}

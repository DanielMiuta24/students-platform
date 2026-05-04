import type { PostDoc } from '../models/post.model';

export class PostScorer {
  static calculateScore(post: PostDoc, preferredCategories: string[]): number {
    const recencyScore = this.calculateRecencyScore(post.createdAt);
    const engagementScore = this.calculateEngagementScore(
      post.likeCount,
      post.commentCount,
      post.viewCount
    );
    const categoryScore = this.calculateCategoryScore(post.category, preferredCategories);

    return recencyScore + engagementScore + categoryScore;
  }

  private static calculateRecencyScore(createdAt: Date): number {
    const now = new Date();
    const hoursAgo = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
    return Math.max(0, 100 - hoursAgo);
  }

  private static calculateEngagementScore(likeCount: number, commentCount: number, viewCount: number): number {
    return likeCount * 2 + commentCount * 4 + viewCount * 0.5;
  }

  private static calculateCategoryScore(postCategory: any, preferredCategories: string[]): number {
    if (!postCategory) return 0;

    const categoryId = typeof postCategory === 'string'
      ? postCategory
      : postCategory._id?.toString() || postCategory.toString();

    return preferredCategories.includes(categoryId) ? 50 : 0;
  }
}

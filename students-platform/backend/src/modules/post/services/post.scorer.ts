import type { PostDoc } from '../models/post.model';

interface ScoringContext {
  preferredCategories: string[];
  currentUserId?: string;
  followingIds?: string[];
  friendIds?: string[];
}

export class PostScorer {
  static calculateScore(post: PostDoc, context: ScoringContext): number {
    const recencyScore = this.calculateRecencyScore(post.createdAt);
    const engagementScore = this.calculateEngagementScore(
      post.likeCount,
      post.commentCount,
      post.viewCount
    );
    const categoryScore = this.calculateCategoryScore(post.category, context.preferredCategories);
    const socialScore = this.calculateSocialScore(post, context);

    return recencyScore + engagementScore + categoryScore + socialScore;
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

  private static calculateSocialScore(post: PostDoc, context: ScoringContext): number {
    if (!context.currentUserId) return 0;

    const authorId = typeof post.author === 'string'
      ? post.author
      : post.author?._id?.toString();

    if (!authorId) return 0;

    let score = 0;

    if (authorId === context.currentUserId) {
      score += 200;
    }

    if (context.friendIds?.includes(authorId)) {
      score += 150;
    } else if (context.followingIds?.includes(authorId)) {
      score += 100;
    }

    return score;
  }
}

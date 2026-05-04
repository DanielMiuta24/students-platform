import { PostScorer } from '../../../modules/post/services/post.scorer';
import type { PostDoc } from '../../../modules/post/models/post.model';

describe('PostScorer', () => {
  describe('calculateScore', () => {
    it('should calculate total score correctly', () => {
      const mockPost = {
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        likeCount: 10,
        commentCount: 5,
        viewCount: 100,
        category: 'cat123',
      } as unknown as PostDoc;

      const preferredCategories = ['cat123'];

      const score = PostScorer.calculateScore(mockPost, preferredCategories);

      // recencyScore = max(0, 100 - 2) = 98
      // engagementScore = 10*2 + 5*4 + 100*0.5 = 20 + 20 + 50 = 90
      // categoryScore = 50 (in preferred categories)
      // TOTAL = 98 + 90 + 50 = 238

      expect(score).toBeCloseTo(238, 0);
    });

    it('should calculate score with no preferred category bonus', () => {
      const mockPost = {
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        likeCount: 5,
        commentCount: 2,
        viewCount: 50,
        category: 'cat123',
      } as unknown as PostDoc;

      const preferredCategories = ['cat456']; // Different category

      const score = PostScorer.calculateScore(mockPost, preferredCategories);

      // recencyScore = max(0, 100 - 1) = 99
      // engagementScore = 5*2 + 2*4 + 50*0.5 = 10 + 8 + 25 = 43
      // categoryScore = 0 (not in preferred categories)
      // TOTAL = 99 + 43 + 0 = 142

      expect(score).toBeCloseTo(142, 0);
    });

    it('should calculate score with empty preferred categories', () => {
      const mockPost = {
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        likeCount: 20,
        commentCount: 10,
        viewCount: 200,
        category: 'cat123',
      } as unknown as PostDoc;

      const score = PostScorer.calculateScore(mockPost, []);

      // recencyScore = max(0, 100 - 5) = 95
      // engagementScore = 20*2 + 10*4 + 200*0.5 = 40 + 40 + 100 = 180
      // categoryScore = 0 (no preferred categories)
      // TOTAL = 95 + 180 + 0 = 275

      expect(score).toBeCloseTo(275, 0);
    });
  });

  describe('calculateRecencyScore', () => {
    it('should return 100 for brand new post', () => {
      const now = new Date();
      const score = PostScorer['calculateRecencyScore'](now);

      expect(score).toBeCloseTo(100, 0);
    });

    it('should return decreasing score for older posts', () => {
      const oneHourAgo = new Date(Date.now() - 1 * 60 * 60 * 1000);
      const score = PostScorer['calculateRecencyScore'](oneHourAgo);

      expect(score).toBeCloseTo(99, 0);
    });

    it('should return 50 for 50-hour-old post', () => {
      const fiftyHoursAgo = new Date(Date.now() - 50 * 60 * 60 * 1000);
      const score = PostScorer['calculateRecencyScore'](fiftyHoursAgo);

      expect(score).toBeCloseTo(50, 0);
    });

    it('should return 0 for posts older than 100 hours', () => {
      const veryOld = new Date(Date.now() - 150 * 60 * 60 * 1000);
      const score = PostScorer['calculateRecencyScore'](veryOld);

      expect(score).toBe(0);
    });

    it('should never return negative scores', () => {
      const veryOld = new Date(Date.now() - 1000 * 60 * 60 * 1000);
      const score = PostScorer['calculateRecencyScore'](veryOld);

      expect(score).toBeGreaterThanOrEqual(0);
    });
  });

  describe('calculateEngagementScore', () => {
    it('should calculate engagement score with all metrics', () => {
      const score = PostScorer['calculateEngagementScore'](10, 5, 100);

      // 10*2 + 5*4 + 100*0.5 = 20 + 20 + 50 = 90
      expect(score).toBe(90);
    });

    it('should weight comments highest', () => {
      const score = PostScorer['calculateEngagementScore'](0, 10, 0);

      // 0*2 + 10*4 + 0*0.5 = 0 + 40 + 0 = 40
      expect(score).toBe(40);
    });

    it('should weight likes medium', () => {
      const score = PostScorer['calculateEngagementScore'](10, 0, 0);

      // 10*2 + 0*4 + 0*0.5 = 20 + 0 + 0 = 20
      expect(score).toBe(20);
    });

    it('should weight views lowest', () => {
      const score = PostScorer['calculateEngagementScore'](0, 0, 100);

      // 0*2 + 0*4 + 100*0.5 = 0 + 0 + 50 = 50
      expect(score).toBe(50);
    });

    it('should handle zero engagement', () => {
      const score = PostScorer['calculateEngagementScore'](0, 0, 0);

      expect(score).toBe(0);
    });

    it('should handle large numbers', () => {
      const score = PostScorer['calculateEngagementScore'](1000, 500, 10000);

      // 1000*2 + 500*4 + 10000*0.5 = 2000 + 2000 + 5000 = 9000
      expect(score).toBe(9000);
    });
  });

  describe('calculateCategoryScore', () => {
    it('should return 50 when category is in preferred list', () => {
      const score = PostScorer['calculateCategoryScore']('cat123', ['cat123', 'cat456']);

      expect(score).toBe(50);
    });

    it('should return 0 when category is not in preferred list', () => {
      const score = PostScorer['calculateCategoryScore']('cat789', ['cat123', 'cat456']);

      expect(score).toBe(0);
    });

    it('should return 0 when preferred list is empty', () => {
      const score = PostScorer['calculateCategoryScore']('cat123', []);

      expect(score).toBe(0);
    });

    it('should return 0 when category is null', () => {
      const score = PostScorer['calculateCategoryScore'](null, ['cat123']);

      expect(score).toBe(0);
    });

    it('should return 0 when category is undefined', () => {
      const score = PostScorer['calculateCategoryScore'](undefined, ['cat123']);

      expect(score).toBe(0);
    });

    it('should handle category as object with _id', () => {
      const categoryObject = { _id: 'cat123', name: 'Technology' };
      const score = PostScorer['calculateCategoryScore'](categoryObject as any, ['cat123']);

      expect(score).toBe(50);
    });

    it('should handle category as object with toString', () => {
      const categoryObject = {
        toString: () => 'cat123',
      };
      const score = PostScorer['calculateCategoryScore'](categoryObject as any, ['cat123']);

      expect(score).toBe(50);
    });
  });

  describe('Complex scoring scenarios', () => {
    it('should rank viral old post higher than new post with no engagement', () => {
      const viralOldPost = {
        createdAt: new Date(Date.now() - 50 * 60 * 60 * 1000), // 50 hours old
        likeCount: 500,
        commentCount: 200,
        viewCount: 5000,
        category: 'cat123',
      } as unknown as PostDoc;

      const newPost = {
        createdAt: new Date(),
        likeCount: 0,
        commentCount: 0,
        viewCount: 0,
        category: 'cat123',
      } as unknown as PostDoc;

      const viralScore = PostScorer.calculateScore(viralOldPost, []);
      const newScore = PostScorer.calculateScore(newPost, []);

      // Viral: recency=50, engagement=(500*2 + 200*4 + 5000*0.5)=1000+800+2500=4300, category=0 = 4350
      // New: recency=100, engagement=0, category=0 = 100

      expect(viralScore).toBeGreaterThan(newScore);
      expect(viralScore).toBeCloseTo(4350, 0);
      expect(newScore).toBeCloseTo(100, 0);
    });

    it('should apply category bonus correctly', () => {
      const post = {
        createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
        likeCount: 10,
        commentCount: 5,
        viewCount: 100,
        category: 'cat123',
      } as unknown as PostDoc;

      const scoreWithBonus = PostScorer.calculateScore(post, ['cat123']);
      const scoreWithoutBonus = PostScorer.calculateScore(post, ['cat456']);

      expect(scoreWithBonus - scoreWithoutBonus).toBeCloseTo(50, 0);
    });

    it('should handle posts with no category gracefully', () => {
      const post = {
        createdAt: new Date(),
        likeCount: 10,
        commentCount: 5,
        viewCount: 100,
        category: null,
      } as unknown as PostDoc;

      const score = PostScorer.calculateScore(post, ['cat123']);

      // Should not throw and should calculate without category bonus
      expect(score).toBeGreaterThan(0);
      expect(score).toBeCloseTo(190, 0); // recency + engagement + no category bonus
    });
  });
});

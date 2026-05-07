import type { LikeDoc } from '../models';
import type { SafeLike } from '../types';

export class LikeMapper {
  static toSafeLike(like: LikeDoc): SafeLike {
    // Check if user is populated
    const isUserPopulated = like.user && typeof like.user === 'object' && 'username' in like.user;

    return {
      id: like._id.toString(),
      user: isUserPopulated ? {
        id: (like.user as any)._id.toString(),
        name: (like.user as any).name,
        username: (like.user as any).username,
        avatar: (like.user as any).avatar,
      } : (typeof like.user === 'string' ? like.user : like.user?.toString() ?? ''),
      likeable: typeof like.likeable === 'string' ? like.likeable : like.likeable.toString(),
      likeableType: like.likeableType,
      createdAt: like.createdAt,
    };
  }

  static toSafeLikes(likes: LikeDoc[]): SafeLike[] {
    return likes.map(like => this.toSafeLike(like));
  }
}

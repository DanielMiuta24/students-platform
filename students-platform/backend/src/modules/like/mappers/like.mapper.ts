import type { LikeDoc } from '../models';
import type { SafeLike } from '../types';

export class LikeMapper {
  static toSafeLike(like: LikeDoc): SafeLike {
    return {
      id: like._id.toString(),
      user: typeof like.user === 'string' ? like.user : like.user?.toString() ?? '',
      likeable: typeof like.likeable === 'string' ? like.likeable : like.likeable.toString(),
      likeableType: like.likeableType,
      createdAt: like.createdAt,
    };
  }

  static toSafeLikes(likes: LikeDoc[]): SafeLike[] {
    return likes.map(like => this.toSafeLike(like));
  }
}

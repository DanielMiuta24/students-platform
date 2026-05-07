import type { LikeDoc, LikeableType } from '../models';

export interface CreateLikeDTO {
  userId: string;
  likeableId: string;
  likeableType: LikeableType;
}

export interface LikeQueryDTO {
  userId?: string;
  likeableId?: string;
  likeableType?: LikeableType;
}

export interface SafeUser {
  id: string;
  name: string;
  username: string;
  avatar?: string;
}

export interface SafeLike {
  id: string;
  user: string | SafeUser;
  likeable: string;
  likeableType: LikeableType;
  createdAt: Date;
}

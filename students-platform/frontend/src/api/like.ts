import { secureApi } from '../services/secureApi';
import { api } from '../services/api';

export interface CreateLikePayload {
  likeableId: string;
  likeableType: 'Post' | 'Comment';
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
  likeableType: 'Post' | 'Comment';
  createdAt: Date;
}

export interface LikesResponse {
  likes: SafeLike[];
  count: number;
}

export interface LikeStatusResponse {
  hasLiked: boolean;
}

export const likePost = async (postId: string): Promise<SafeLike> => {
  const { data } = await secureApi.post('/likes/', {
    likeableId: postId,
    likeableType: 'Post',
  });
  return data.like;
};

export const unlikePost = async (postId: string): Promise<void> => {
  await secureApi.delete(`/likes/Post/${postId}`);
};

export const likeComment = async (commentId: string): Promise<SafeLike> => {
  const { data } = await secureApi.post('/likes/', {
    likeableId: commentId,
    likeableType: 'Comment',
  });
  return data.like;
};

export const unlikeComment = async (commentId: string): Promise<void> => {
  await secureApi.delete(`/likes/Comment/${commentId}`);
};

export const checkLikeStatus = async (
  likeableId: string,
  likeableType: 'Post' | 'Comment'
): Promise<boolean> => {
  const { data } = await secureApi.get<LikeStatusResponse>(
    `/likes/${likeableType}/${likeableId}/status`
  );
  return data.hasLiked;
};

export const getLikes = async (
  likeableId: string,
  likeableType: 'Post' | 'Comment'
): Promise<LikesResponse> => {
  const { data } = await api.get<LikesResponse>(
    `/likes/${likeableType}/${likeableId}`
  );
  return data;
};

export const getUserLikes = async (): Promise<LikesResponse> => {
  const { data } = await secureApi.get<LikesResponse>('/likes/user/me');
  return data;
};

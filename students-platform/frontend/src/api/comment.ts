import { secureApi } from '../services/secureApi';
import { api } from '../services/api';

export interface CreateCommentPayload {
  postId: string;
  content: string;
  parentCommentId?: string;
}

export interface UpdateCommentPayload {
  content: string;
}

export interface SafeComment {
  id: string;
  postId: string;
  authorId: string;
  author?: {
    name: string;
    username: string;
    avatar?: string;
  };
  content: string;
  parentCommentId: string | null;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CommentsResponse {
  comments: SafeComment[];
  pagination: CommentPagination;
}

export interface CommentCountResponse {
  count: number;
}

export const createComment = async (
  payload: CreateCommentPayload
): Promise<SafeComment> => {
  const { data } = await secureApi.post('/comments/', payload);
  return data.comment;
};

export const getCommentsByPost = async (
  postId: string,
  page: number = 1,
  limit: number = 10,
  parentCommentId?: string
): Promise<CommentsResponse> => {
  const params: any = { page, limit };
  if (parentCommentId) {
    params.parentCommentId = parentCommentId;
  }
  const { data } = await api.get<CommentsResponse>(`/comments/post/${postId}`, {
    params,
  });
  return data;
};

export const getCommentCount = async (postId: string): Promise<number> => {
  const { data } = await api.get<CommentCountResponse>(
    `/comments/post/${postId}/count`
  );
  return data.count;
};

export const getComment = async (commentId: string): Promise<SafeComment> => {
  const { data } = await api.get(`/comments/${commentId}`);
  return data.comment;
};

export const getRepliesCount = async (commentId: string): Promise<number> => {
  const { data } = await api.get<CommentCountResponse>(
    `/comments/${commentId}/replies/count`
  );
  return data.count;
};

export const updateComment = async (
  commentId: string,
  payload: UpdateCommentPayload
): Promise<SafeComment> => {
  const { data } = await secureApi.put(`/comments/${commentId}`, payload);
  return data.comment;
};

export const deleteComment = async (commentId: string): Promise<void> => {
  await secureApi.delete(`/comments/${commentId}`);
};

export const notifyTyping = async (postId: string, isTyping: boolean, parentCommentId?: string): Promise<void> => {
  await secureApi.post(`/comments/post/${postId}/typing`, { isTyping, parentCommentId });
};

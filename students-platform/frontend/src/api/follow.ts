import { secureApi } from '../services/secureApi';
import { api } from '../services/api';

export interface SafeFollow {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
}

export interface FollowStatusResponse {
  isFollowing: boolean;
  followsBack: boolean;
}

export interface FollowStatsResponse {
  followersCount: number;
  followingCount: number;
}

export interface PaginatedFollowResponse {
  users: SafeFollow[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export const followUser = async (userId: string): Promise<void> => {
  await secureApi.post(`/follow/${userId}`);
};

export const unfollowUser = async (userId: string): Promise<void> => {
  await secureApi.delete(`/follow/${userId}`);
};

export const checkFollowStatus = async (userId: string): Promise<FollowStatusResponse> => {
  const { data } = await secureApi.get<FollowStatusResponse>(
    `/follow/${userId}/status`
  );
  return data;
};

export const getFollowers = async (
  userId: string,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedFollowResponse> => {
  const { data } = await api.get<PaginatedFollowResponse>(
    `/follow/${userId}/followers`,
    { params: { page, limit } }
  );
  return data;
};

export const getFollowing = async (
  userId: string,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedFollowResponse> => {
  const { data } = await api.get<PaginatedFollowResponse>(
    `/follow/${userId}/following`,
    { params: { page, limit } }
  );
  return data;
};

export const getFollowStats = async (
  userId: string
): Promise<FollowStatsResponse> => {
  const { data } = await api.get<FollowStatsResponse>(`/follow/${userId}/stats`);
  return data;
};

export const getFriends = async (
  userId: string,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedFollowResponse> => {
  const { data } = await api.get<PaginatedFollowResponse>(
    `/follow/${userId}/friends`,
    { params: { page, limit } }
  );
  return data;
};

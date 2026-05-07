export interface FollowDTO {
  followerId: string;
  followingId: string;
}

export interface SafeFollow {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio?: string;
}

export interface FollowStats {
  followersCount: number;
  followingCount: number;
}

export interface PaginatedFollowResult {
  users: SafeFollow[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

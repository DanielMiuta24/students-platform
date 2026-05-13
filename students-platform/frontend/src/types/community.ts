/**
 * Frontend types matching backend Community API
 * Based on backend/src/modules/community/types/community.types.ts
 */

export type CommunityVisibility = 'public' | 'private';

export interface SafeFounder {
  id: string;
  name: string;
  username: string;
  avatar?: string;
}

export interface SafeCategory {
  id: string;
  name: string;
  slug: string;
}

export interface SafeCommunity {
  id: string;
  name: string;
  slug: string;
  description?: string;
  rules?: string;
  category: string | SafeCategory;
  coverImage?: string;
  founder: string | SafeFounder;
  memberCount: number;
  postCount: number;
  isActive: boolean;
  visibility: CommunityVisibility;
  requiresApproval: boolean;
  allowMemberPosts: boolean;
  allowMemberInvites: boolean;
  joined?: boolean;
  role?: string;
  hasPendingRequest?: boolean;
  isBanned?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunitiesResult {
  communities: SafeCommunity[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface CommunityMember {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  type?: string;
  role: string;
  joinedAt: Date;
}

export interface CommunityMembersResult {
  members: CommunityMember[];
  total: number;
}

export interface CreateCommunityPayload {
  name: string;
  description: string;
  category: string;
  coverImage?: string;
  rules?: string;
  visibility?: CommunityVisibility;
  requiresApproval?: boolean;
  invitations?: {
    emails?: string[];
    userIds?: string[];
  };
}

export interface UpdateCommunityPayload {
  name?: string;
  description?: string;
  category?: string;
  coverImage?: string;
  rules?: string;
  visibility?: CommunityVisibility;
  requiresApproval?: boolean;
  allowMemberPosts?: boolean;
  allowMemberInvites?: boolean;
}

export interface InviteUsersPayload {
  emails?: string[];
  userIds?: string[];
}

export interface SafeInvitation {
  id: string;
  community: string;
  invitedBy: string;
  recipientEmail?: string;
  recipientUser?: string;
  status: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface SafeJoinRequest {
  id: string;
  community: string;
  user: string | {
    id: string;
    name: string;
    username: string;
    avatar?: string;
  };
  status: string;
  message?: string;
  createdAt: Date;
}

export interface CreateJoinRequestPayload {
  message?: string;
}

export interface UpdateMemberRolePayload {
  role: 'admin' | 'member';
}

export interface TransferOwnershipPayload {
  newOwnerId: string;
}

/**
 * Validation constraints
 */
export const COMMUNITY_VALIDATION = {
  NAME_MIN_LENGTH: 3,
  NAME_MAX_LENGTH: 50,
  DESCRIPTION_MAX_LENGTH: 300,
  RULES_MAX_LENGTH: 1000,
} as const;

/**
 * Visibility options
 */
export const COMMUNITY_VISIBILITY = {
  PUBLIC: 'public' as CommunityVisibility,
  PRIVATE: 'private' as CommunityVisibility,
};

/**
 * Community role constants
 */
export const COMMUNITY_ROLE = {
  FOUNDER: 'founder',
  ADMIN: 'admin',
  MEMBER: 'member',
} as const;

export type CommunityRole = typeof COMMUNITY_ROLE[keyof typeof COMMUNITY_ROLE];

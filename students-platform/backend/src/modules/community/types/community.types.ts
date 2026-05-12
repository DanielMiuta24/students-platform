import type { CommunityDoc } from '../models';
import type { CommunityVisibility } from '../constants';

export interface CreateCommunityDTO {
  name: string;
  description: string;
  category: string;
  founderId: string;
  coverImage?: string;
  rules?: string;
  visibility?: CommunityVisibility;
  requiresApproval?: boolean;
  invitations?: {
    emails?: string[];
    userIds?: string[];
  };
}

export interface UpdateCommunityDTO {
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

export interface GetCommunitiesDTO {
  cursor?: string;
  limit?: number;
  category?: string;
  search?: string;
  founderId?: string;
}

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

export interface InviteUsersDTO {
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

export interface UpdateMemberRoleDTO {
  role: 'admin' | 'member';
}

export interface CreateJoinRequestDTO {
  message?: string;
}

export interface TransferOwnershipDTO {
  newOwnerId: string;
}

import { CommunityModel, type CommunityDoc, CommunityInvitationModel, CommunityJoinRequestModel, OwnershipTransferModel } from '../models';
import { categoryService } from '../../category/services';
import { imageService } from '../../image/services';
import { notificationService } from '../../notification/services';

import type {
  CreateCommunityDTO,
  UpdateCommunityDTO,
  GetCommunitiesDTO,
  CommunitiesResult,
  InviteUsersDTO,
} from '../types';
import { COMMUNITY_ERROR, COMMUNITY_ROLE, COMMUNITY_VALIDATION, COMMUNITY_VISIBILITY } from '../constants';
import { CommunityCreateBuilder, CommunityUpdateBuilder, CommunityQueryBuilder } from '../builders';
import { CommunityMapper } from '../mappers';
import type { UploadedFile } from '../../image/services';
import { toSlug } from '../../../shared/utils/slug';

export class CommunityService {
  private generateRandomSuffix(length: number = 6): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private async generateUniqueSlug(baseName: string): Promise<string> {
    const baseSlug = toSlug(baseName);

    // Try base slug first
    const baseExists = await CommunityModel.exists({ slug: baseSlug });
    if (!baseExists) {
      return baseSlug;
    }

    // If base slug exists, append random suffix and retry up to 5 times
    const maxRetries = 5;
    for (let i = 0; i < maxRetries; i++) {
      const randomSuffix = this.generateRandomSuffix(6);
      const candidateSlug = `${baseSlug}-${randomSuffix}`;

      const exists = await CommunityModel.exists({ slug: candidateSlug });
      if (!exists) {
        return candidateSlug;
      }
    }

    // Fallback to timestamp-based suffix if random fails
    const timestampSuffix = Date.now().toString(36);
    return `${baseSlug}-${timestampSuffix}`;
  }

  async createCommunity(data: CreateCommunityDTO, coverImageFile?: UploadedFile): Promise<CommunityDoc> {
    const slug = await this.generateUniqueSlug(data.name);

    const isCategoryActive = await categoryService.isActiveCategory(data.category);
    if (!isCategoryActive) {
      throw new Error(COMMUNITY_ERROR.CATEGORY_NOT_FOUND);
    }

    let coverImageId: string | undefined;
    if (coverImageFile) {
      const uploadResult = await imageService.uploadImagesForPost([coverImageFile], data.founderId);
      coverImageId = uploadResult[0]?.imageId;
    }

    const communityData = new CommunityCreateBuilder()
      .fromDTO({ ...data, coverImage: coverImageId })
      .build();

    const community = new CommunityModel(communityData);
    const savedCommunity = await community.save();

    if (data.invitations) {
      await this.sendInvitations(savedCommunity._id.toString(), data.founderId, data.invitations);
    }

    return savedCommunity;
  }

  async getCommunityById(idOrSlug: string, userId?: string): Promise<CommunityDoc> {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);

    const community = await CommunityModel.findOne(
      isObjectId ? { _id: idOrSlug } : { slug: idOrSlug }
    )
      .populate('founder', 'name username avatar')
      .populate('category', 'name slug')
      .populate('coverImage', 'url')
      .populate('members.user', 'name username avatar type')
      .exec();

    if (!community) {
      throw new Error(COMMUNITY_ERROR.NOT_FOUND);
    }

    // Note: We return the community data even for private communities
    // The frontend will check membership via canViewCommunityPosts endpoint
    // and handle display accordingly (showing "access denied" for non-members)

    return community;
  }

  async updateCommunity(
    communityId: string,
    data: UpdateCommunityDTO,
    userId: string,
    coverImageFile?: UploadedFile
  ): Promise<CommunityDoc> {
    const community = await CommunityModel.findById(communityId);

    if (!community) {
      throw new Error(COMMUNITY_ERROR.NOT_FOUND);
    }

    if (!this.isAdmin(community, userId)) {
      throw new Error(COMMUNITY_ERROR.NOT_ADMIN);
    }

    if (data.category) {
      const isCategoryActive = await categoryService.isActiveCategory(data.category);
      if (!isCategoryActive) {
        throw new Error(COMMUNITY_ERROR.CATEGORY_NOT_FOUND);
      }
    }

    let coverImageId: string | undefined | null;
    if (coverImageFile) {
      if (community.coverImage) {
        try {
          const oldImageId = community.coverImage.toString();
          const oldImage = await imageService.getImageById(oldImageId);
          if (oldImage) {
            await imageService.deleteImage(oldImage.publicId);
            await imageService.deleteImageFromDb(oldImageId);
          }
        } catch (err) {
        }
      }
      const uploadResult = await imageService.uploadImagesForPost([coverImageFile], userId);
      coverImageId = uploadResult[0]?.imageId;
    } else if (data.coverImage === '' || data.coverImage === 'null' || data.coverImage === null) {
      if (community.coverImage) {
        try {
          const oldImageId = community.coverImage.toString();
          const oldImage = await imageService.getImageById(oldImageId);
          if (oldImage) {
            await imageService.deleteImage(oldImage.publicId);
            await imageService.deleteImageFromDb(oldImageId);
          }
        } catch (err) {
        }
      }
      coverImageId = null;
    }

    const updateData = new CommunityUpdateBuilder()
      .fromDTO({ ...data, coverImage: coverImageId as string | undefined })
      .build();

    if (coverImageId === null) {
      updateData.coverImage = null;
    }

    if (data.name) {
      const newSlug = toSlug(data.name);
      if (newSlug !== community.slug) {
        const slugExists = await CommunityModel.exists({ slug: newSlug, _id: { $ne: communityId } });
        if (slugExists) {
          throw new Error(COMMUNITY_ERROR.SLUG_EXISTS);
        }
        updateData.slug = newSlug;
      }
    }

    const updated = await CommunityModel.findByIdAndUpdate(communityId, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('founder', 'name username avatar')
      .populate('category', 'name slug')
      .populate('coverImage', 'url')
      .populate('members.user', 'name username avatar type')
      .exec();

    return updated!;
  }

  async deleteCommunity(communityId: string, userId: string): Promise<void> {
    const community = await CommunityModel.findById(communityId);

    if (!community) {
      throw new Error(COMMUNITY_ERROR.NOT_FOUND);
    }

    const founderId = typeof community.founder === 'string' ? community.founder : community.founder!.toString();

    if (founderId !== userId) {
      throw new Error(COMMUNITY_ERROR.UNAUTHORIZED);
    }

    const { postService } = await import('../../post/services');
    await postService.deletePostsByCommunity(communityId);

    await CommunityModel.findByIdAndDelete(communityId);
    await CommunityInvitationModel.deleteMany({ community: communityId });
    await CommunityJoinRequestModel.deleteMany({ community: communityId });
    await OwnershipTransferModel.deleteMany({ community: communityId });
  }

  async getCommunities(dto: GetCommunitiesDTO, userId?: string): Promise<CommunitiesResult> {
    const builder = new CommunityQueryBuilder().fromDTO(dto);
    const query = builder.build();

    // Exclude communities where user is banned (only if userId is a valid string)
    if (userId && userId !== 'undefined' && typeof userId === 'string') {
      query.bannedUsers = { $ne: userId };
    }

    // Show public communities, plus private communities where user is a member
    if (userId && userId !== 'undefined' && typeof userId === 'string') {
      // User is authenticated: show public communities OR private communities where they are a member
      query.$or = [
        { visibility: COMMUNITY_VISIBILITY.PUBLIC },
        {
          visibility: COMMUNITY_VISIBILITY.PRIVATE,
          'members.user': userId
        }
      ];
    } else {
      // User is not authenticated: only show public communities
      query.visibility = COMMUNITY_VISIBILITY.PUBLIC;
    }

    const safeLimit = dto.limit && dto.limit > 0 && dto.limit <= 100 ? dto.limit : 10;

    const communities = await CommunityModel.find(query)
      .populate('founder', 'name username avatar')
      .populate('category', 'name slug')
      .populate('coverImage', 'url')
      .sort({ _id: -1 })
      .limit(safeLimit + 1)
      .exec();

    const hasMore = communities.length > safeLimit;
    const resultCommunities = hasMore ? communities.slice(0, safeLimit) : communities;

    const nextCursor =
      hasMore && resultCommunities.length > 0
        ? resultCommunities[resultCommunities.length - 1]._id.toString()
        : null;

    // Fetch pending join requests for the user
    let pendingRequestCommunityIds: string[] = [];
    if (userId) {
      const pendingRequests = await CommunityJoinRequestModel.find({
        user: userId,
        status: 'pending',
      }).select('community').exec();

      pendingRequestCommunityIds = pendingRequests
        .filter(req => req.community)
        .map(req => req.community!.toString());
    }

    return {
      communities: CommunityMapper.toSafeCommunities(resultCommunities, userId, pendingRequestCommunityIds),
      nextCursor,
      hasMore,
    };
  }

  async joinCommunity(communityId: string, userId: string, bypassApproval: boolean = false): Promise<CommunityDoc> {
    const community = await CommunityModel.findById(communityId);

    if (!community) {
      throw new Error(COMMUNITY_ERROR.NOT_FOUND);
    }

    if (community.bannedUsers?.some((u) => u.toString() === userId)) {
      throw new Error(COMMUNITY_ERROR.USER_BANNED);
    }

    const isMember = community.members?.some((m: any) => m.user.toString() === userId);
    if (isMember) {
      throw new Error(COMMUNITY_ERROR.ALREADY_MEMBER);
    }

    if (community.requiresApproval && !bypassApproval) {
      throw new Error(COMMUNITY_ERROR.REQUIRES_APPROVAL);
    }

    const updated = await CommunityModel.findByIdAndUpdate(
      communityId,
      {
        $push: {
          members: {
            user: userId,
            role: COMMUNITY_ROLE.MEMBER,
            joinedAt: new Date(),
          },
        },
        $inc: { memberCount: 1 },
      },
      { new: true }
    )
      .populate('founder', 'name username avatar')
      .populate('category', 'name slug')
      .populate('coverImage', 'url')
      .populate('members.user', 'name username avatar type')
      .exec();

    const founderId = community.founder?.toString();
    if (founderId && founderId !== userId) {
      await notificationService.createNotification({
        recipientId: founderId,
        actorId: userId,
        type: 'community_join',
        targetModel: 'Community',
        targetId: communityId,
      }).catch(err => console.error('Failed to create community join notification:', err));
    }

    return updated!;
  }

  async leaveCommunity(communityId: string, userId: string): Promise<void> {
    const community = await CommunityModel.findById(communityId);

    if (!community) {
      throw new Error(COMMUNITY_ERROR.NOT_FOUND);
    }

    const founderId = typeof community.founder === 'string' ? community.founder : community.founder!.toString();

    if (founderId === userId) {
      throw new Error(COMMUNITY_ERROR.CANNOT_LEAVE_AS_FOUNDER);
    }

    const isMember = community.members?.some((m: any) => m.user.toString() === userId);
    if (!isMember) {
      throw new Error(COMMUNITY_ERROR.NOT_MEMBER);
    }

    await CommunityModel.findByIdAndUpdate(communityId, {
      $pull: { members: { user: userId } },
      $inc: { memberCount: -1 },
    });
  }

  async getCommunityMembers(communityIdOrSlug: string) {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(communityIdOrSlug);

    const community = await CommunityModel.findOne(
      isObjectId ? { _id: communityIdOrSlug } : { slug: communityIdOrSlug }
    )
      .populate('members.user', 'name username avatar type')
      .exec();

    if (!community) {
      throw new Error(COMMUNITY_ERROR.NOT_FOUND);
    }

    const members = Array.isArray(community.members) ? community.members : [];

    return {
      members: members.map((m: any) => ({
        id: m.user._id.toString(),
        name: m.user.name,
        username: m.user.username,
        avatar: m.user.avatar,
        type: m.user.type,
        role: m.role,
        joinedAt: m.joinedAt,
      })),
      total: community.memberCount,
    };
  }

  private async findCommunityByIdOrSlug(idOrSlug: string): Promise<CommunityDoc | null> {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    return await CommunityModel.findOne(
      isObjectId ? { _id: idOrSlug } : { slug: idOrSlug }
    ).exec();
  }

  private isAdmin(community: CommunityDoc, userId: string): boolean {
    if (community.founder) {
      const founderId = typeof community.founder === 'string' ? community.founder : community.founder.toString();
      if (founderId === userId) return true;
    }

    const member = community.members?.find((m: any) => m.user.toString() === userId);
    return member?.role === COMMUNITY_ROLE.ADMIN;
  }

  private isFounder(community: CommunityDoc, userId: string): boolean {
    const founderId = typeof community.founder === 'string' ? community.founder : community.founder!.toString();
    return founderId === userId;
  }

  async sendInvitations(communityId: string, userId: string, inviteData: InviteUsersDTO) {
    const community = await CommunityModel.findById(communityId);

    if (!community) {
      throw new Error(COMMUNITY_ERROR.NOT_FOUND);
    }

    if (!community.allowMemberInvites && !this.isAdmin(community, userId)) {
      throw new Error(COMMUNITY_ERROR.UNAUTHORIZED);
    }

    const invitations = [];
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + COMMUNITY_VALIDATION.INVITATION_EXPIRY_DAYS);

    if (inviteData.emails) {
      for (const email of inviteData.emails) {
        invitations.push({
          community: communityId,
          invitedBy: userId,
          recipientEmail: email,
          status: 'pending',
          expiresAt,
        });
      }
    }

    if (inviteData.userIds) {
      for (const recipientUserId of inviteData.userIds) {
        const existingInvitation = await CommunityInvitationModel.findOne({
          community: communityId,
          recipientUser: recipientUserId,
          status: 'pending',
          expiresAt: { $gt: new Date() },
        });

        if (existingInvitation) {
          continue;
        }

        const invitation = await CommunityInvitationModel.create({
          community: communityId,
          invitedBy: userId,
          recipientUser: recipientUserId,
          status: 'pending',
          expiresAt,
        });

        await notificationService.createNotification({
          recipientId: recipientUserId,
          actorId: userId,
          type: 'community_invite',
          targetModel: 'CommunityInvitation',
          targetId: invitation._id.toString(),
        }).catch(err => console.error('Failed to create community invite notification:', err));
      }
    }

    if (invitations.length > 0) {
      await CommunityInvitationModel.insertMany(invitations);
    }

    const totalInvitations = invitations.length + (inviteData.userIds?.length || 0);
    return { invitationsSent: totalInvitations };
  }

  async getInvitations(communityId: string, userId: string) {
    const community = await CommunityModel.findById(communityId);

    if (!community) {
      throw new Error(COMMUNITY_ERROR.NOT_FOUND);
    }

    if (!this.isAdmin(community, userId)) {
      throw new Error(COMMUNITY_ERROR.NOT_ADMIN);
    }

    const invitations = await CommunityInvitationModel.find({
      community: communityId,
      status: 'pending',
    })
      .populate('invitedBy', 'name username')
      .populate('recipientUser', 'name username')
      .sort({ createdAt: -1 })
      .exec();

    return invitations.map((inv) => ({
      id: inv._id.toString(),
      recipientEmail: inv.recipientEmail,
      recipientUser: inv.recipientUser
        ? {
            id: (inv.recipientUser as any)._id.toString(),
            name: (inv.recipientUser as any).name,
            username: (inv.recipientUser as any).username,
          }
        : undefined,
      invitedBy: (inv.invitedBy as any).name,
      expiresAt: inv.expiresAt,
      createdAt: inv.createdAt,
    }));
  }

  async cancelInvitation(invitationId: string, userId: string) {
    const invitation = await CommunityInvitationModel.findById(invitationId);

    if (!invitation) {
      throw new Error(COMMUNITY_ERROR.INVITATION_NOT_FOUND);
    }

    const community = await CommunityModel.findById(invitation.community);

    if (!community) {
      throw new Error(COMMUNITY_ERROR.NOT_FOUND);
    }

    const recipientUserId =
      typeof invitation.recipientUser === 'string' ? invitation.recipientUser : invitation.recipientUser?.toString();

    const isRecipient = recipientUserId === userId;
    const isSender = invitation.invitedBy.toString() === userId;
    const isAdmin = this.isAdmin(community, userId);

    if (!isAdmin && !isRecipient && !isSender) {
      throw new Error(COMMUNITY_ERROR.NOT_ADMIN);
    }

    await CommunityInvitationModel.findByIdAndDelete(invitationId);
  }

  async acceptInvitation(invitationId: string, userId: string) {
    const invitation = await CommunityInvitationModel.findById(invitationId);

    if (!invitation) {
      throw new Error(COMMUNITY_ERROR.INVITATION_NOT_FOUND);
    }

    if (invitation.status !== 'pending') {
      throw new Error(COMMUNITY_ERROR.INVITATION_ALREADY_USED);
    }

    if (new Date() > invitation.expiresAt) {
      throw new Error(COMMUNITY_ERROR.INVITATION_EXPIRED);
    }

    const recipientUserId =
      typeof invitation.recipientUser === 'string' ? invitation.recipientUser : invitation.recipientUser?.toString();

    if (recipientUserId !== userId) {
      throw new Error(COMMUNITY_ERROR.UNAUTHORIZED);
    }

    const community = await CommunityModel.findById(invitation.community);

    if (!community) {
      throw new Error(COMMUNITY_ERROR.NOT_FOUND);
    }

    await this.joinCommunity(community._id.toString(), userId, true);

    await CommunityInvitationModel.findByIdAndDelete(invitationId);

    return community;
  }

  async getMyInvitations(userId: string) {
    const invitations = await CommunityInvitationModel.find({
      recipientUser: userId,
      status: 'pending',
      expiresAt: { $gt: new Date() },
    })
      .populate('community', '_id name slug members')
      .populate('invitedBy', '_id name username')
      .sort({ createdAt: -1 })
      .exec();

    const filteredInvitations = invitations.filter((invitation) => {
      const community = invitation.community as any;
      if (!community || !community.members) {
        return true;
      }

      const isMember = community.members.some((m: any) => {
        const memberUserId = typeof m.user === 'string' ? m.user : m.user?.toString();
        return memberUserId === userId;
      });

      return !isMember;
    });

    return filteredInvitations.map((invitation) => ({
      id: invitation._id.toString(),
      community: {
        id: (invitation.community as any)._id.toString(),
        name: (invitation.community as any).name,
        slug: (invitation.community as any).slug,
      },
      invitedBy: {
        id: (invitation.invitedBy as any)._id.toString(),
        name: (invitation.invitedBy as any).name,
        username: (invitation.invitedBy as any).username,
      },
      createdAt: invitation.createdAt,
      expiresAt: invitation.expiresAt,
    }));
  }

  async getMySentInvitations(userId: string) {
    const invitations = await CommunityInvitationModel.find({
      invitedBy: userId,
      status: 'pending',
      expiresAt: { $gt: new Date() },
    })
      .populate('community', '_id name slug')
      .populate('recipientUser', '_id name username avatar')
      .sort({ createdAt: -1 })
      .exec();

    return invitations.map((invitation) => ({
      id: invitation._id.toString(),
      community: {
        id: (invitation.community as any)._id.toString(),
        name: (invitation.community as any).name,
        slug: (invitation.community as any).slug,
      },
      recipientUser: invitation.recipientUser ? {
        id: (invitation.recipientUser as any)._id.toString(),
        name: (invitation.recipientUser as any).name,
        username: (invitation.recipientUser as any).username,
        avatar: (invitation.recipientUser as any).avatar,
      } : null,
      recipientEmail: invitation.recipientEmail,
      createdAt: invitation.createdAt,
      expiresAt: invitation.expiresAt,
    }));
  }

  async createJoinRequest(communityId: string, userId: string, message?: string) {
    const community = await CommunityModel.findById(communityId);

    if (!community) {
      throw new Error(COMMUNITY_ERROR.NOT_FOUND);
    }

    if (community.bannedUsers?.some((u) => u.toString() === userId)) {
      throw new Error(COMMUNITY_ERROR.USER_BANNED);
    }

    if (!community.requiresApproval) {
      return this.joinCommunity(communityId, userId);
    }

    const existingRequest = await CommunityJoinRequestModel.findOne({
      community: communityId,
      user: userId,
      status: 'pending',
    });

    if (existingRequest) {
      throw new Error(COMMUNITY_ERROR.JOIN_REQUEST_EXISTS);
    }

    const joinRequest = new CommunityJoinRequestModel({
      community: communityId,
      user: userId,
      status: 'pending',
      message,
    });

    await joinRequest.save();
    return { message: 'Join request submitted successfully' };
  }

  async cancelJoinRequest(communityId: string, userId: string) {
    const joinRequest = await CommunityJoinRequestModel.findOne({
      community: communityId,
      user: userId,
      status: 'pending',
    });

    if (!joinRequest) {
      throw new Error('No pending join request found');
    }

    await CommunityJoinRequestModel.deleteOne({ _id: joinRequest._id });
    return { message: 'Join request cancelled successfully' };
  }

  async getJoinRequests(communityId: string, userId: string) {
    const community = await CommunityModel.findById(communityId);

    if (!community) {
      throw new Error(COMMUNITY_ERROR.NOT_FOUND);
    }

    if (!this.isAdmin(community, userId)) {
      throw new Error(COMMUNITY_ERROR.NOT_ADMIN);
    }

    const requests = await CommunityJoinRequestModel.find({
      community: communityId,
      status: 'pending',
    })
      .populate('user', 'name username avatar type')
      .sort({ createdAt: -1 })
      .exec();

    return requests.map((req) => ({
      id: req._id.toString(),
      user: {
        id: (req.user as any)._id.toString(),
        name: (req.user as any).name,
        username: (req.user as any).username,
        avatar: (req.user as any).avatar,
        type: (req.user as any).type,
      },
      message: req.message,
      createdAt: req.createdAt,
    }));
  }

  async approveJoinRequest(requestId: string, userId: string) {
    const request = await CommunityJoinRequestModel.findById(requestId);

    if (!request) {
      throw new Error(COMMUNITY_ERROR.JOIN_REQUEST_NOT_FOUND);
    }

    const community = await CommunityModel.findById(request.community);

    if (!community) {
      throw new Error(COMMUNITY_ERROR.NOT_FOUND);
    }

    if (!this.isAdmin(community, userId)) {
      throw new Error(COMMUNITY_ERROR.NOT_ADMIN);
    }

    await CommunityJoinRequestModel.findByIdAndDelete(requestId);

    const requestUserId = typeof request.user === 'string' ? request.user : request.user!.toString();

    return this.joinCommunity(request.community!.toString(), requestUserId, true);
  }

  async rejectJoinRequest(requestId: string, userId: string) {
    const request = await CommunityJoinRequestModel.findById(requestId);

    if (!request) {
      throw new Error(COMMUNITY_ERROR.JOIN_REQUEST_NOT_FOUND);
    }

    const community = await CommunityModel.findById(request.community);

    if (!community) {
      throw new Error(COMMUNITY_ERROR.NOT_FOUND);
    }

    if (!this.isAdmin(community, userId)) {
      throw new Error(COMMUNITY_ERROR.NOT_ADMIN);
    }

    await CommunityJoinRequestModel.findByIdAndDelete(requestId);
    return { message: 'Join request rejected successfully' };
  }

  async removeMember(communityIdOrSlug: string, memberId: string, userId: string) {
    const community = await this.findCommunityByIdOrSlug(communityIdOrSlug);

    if (!community) {
      throw new Error(COMMUNITY_ERROR.NOT_FOUND);
    }

    if (!this.isAdmin(community, userId)) {
      throw new Error(COMMUNITY_ERROR.NOT_ADMIN);
    }

    const founderId = typeof community.founder === 'string' ? community.founder : community.founder!.toString();

    if (founderId === memberId) {
      throw new Error(COMMUNITY_ERROR.CANNOT_REMOVE_FOUNDER);
    }

    await CommunityModel.findByIdAndUpdate(community._id, {
      $pull: { members: { user: memberId } },
      $inc: { memberCount: -1 },
    });
  }

  async banUser(communityIdOrSlug: string, userId: string, adminId: string) {
    const community = await this.findCommunityByIdOrSlug(communityIdOrSlug);

    if (!community) {
      throw new Error(COMMUNITY_ERROR.NOT_FOUND);
    }

    if (!this.isAdmin(community, adminId)) {
      throw new Error(COMMUNITY_ERROR.NOT_ADMIN);
    }

    const member = community.members?.find((m: any) => m.user.toString() === userId);
    if (member && (member.role === COMMUNITY_ROLE.ADMIN || member.role === COMMUNITY_ROLE.FOUNDER)) {
      throw new Error(COMMUNITY_ERROR.CANNOT_BAN_ADMIN);
    }

    // Delete all posts by the user in this community
    const { postService } = await import('../../post/services');
    await postService.deletePostsByAuthorInCommunity(community._id.toString(), userId);

    await CommunityModel.findByIdAndUpdate(community._id, {
      $pull: { members: { user: userId } },
      $addToSet: { bannedUsers: userId },
      $inc: { memberCount: -1 },
    });
  }

  async unbanUser(communityIdOrSlug: string, userId: string, adminId: string) {
    const community = await this.findCommunityByIdOrSlug(communityIdOrSlug);

    if (!community) {
      throw new Error(COMMUNITY_ERROR.NOT_FOUND);
    }

    if (!this.isAdmin(community, adminId)) {
      throw new Error(COMMUNITY_ERROR.NOT_ADMIN);
    }

    await CommunityModel.findByIdAndUpdate(community._id, {
      $pull: { bannedUsers: userId },
    });
  }

  async getBannedUsers(communityIdOrSlug: string, adminId: string) {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(communityIdOrSlug);
    const community = await CommunityModel.findOne(
      isObjectId ? { _id: communityIdOrSlug } : { slug: communityIdOrSlug }
    )
      .populate('bannedUsers', 'name username avatar type')
      .select('bannedUsers members founder')
      .exec();

    if (!community) {
      throw new Error(COMMUNITY_ERROR.NOT_FOUND);
    }

    if (!this.isAdmin(community, adminId)) {
      throw new Error(COMMUNITY_ERROR.NOT_ADMIN);
    }

    return community.bannedUsers || [];
  }

  async updateMemberRole(communityIdOrSlug: string, memberId: string, role: 'admin' | 'member', adminId: string) {
    const community = await this.findCommunityByIdOrSlug(communityIdOrSlug);

    if (!community) {
      throw new Error(COMMUNITY_ERROR.NOT_FOUND);
    }

    if (!this.isFounder(community, adminId)) {
      throw new Error(COMMUNITY_ERROR.UNAUTHORIZED);
    }

    const founderId = typeof community.founder === 'string' ? community.founder : community.founder!.toString();

    if (founderId === memberId) {
      throw new Error(COMMUNITY_ERROR.CANNOT_REMOVE_FOUNDER);
    }

    await CommunityModel.findOneAndUpdate(
      { _id: community._id, 'members.user': memberId },
      { $set: { 'members.$.role': role } }
    );
  }

  async requestOwnershipTransfer(communityId: string, newOwnerId: string, currentOwnerId: string) {
    const community = await CommunityModel.findById(communityId);

    if (!community) {
      throw new Error(COMMUNITY_ERROR.NOT_FOUND);
    }

    if (!this.isFounder(community, currentOwnerId)) {
      throw new Error(COMMUNITY_ERROR.UNAUTHORIZED);
    }

    const newOwnerMember = community.members?.find((m: any) => m.user.toString() === newOwnerId);
    if (!newOwnerMember) {
      throw new Error(COMMUNITY_ERROR.NOT_MEMBER);
    }

    // Check for existing pending transfer
    const existingTransfer = await OwnershipTransferModel.findOne({
      community: communityId,
      status: 'pending',
    });

    if (existingTransfer) {
      throw new Error(COMMUNITY_ERROR.OWNERSHIP_TRANSFER_EXISTS);
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + COMMUNITY_VALIDATION.OWNERSHIP_TRANSFER_EXPIRY_DAYS);

    const transfer = new OwnershipTransferModel({
      community: communityId,
      currentOwner: currentOwnerId,
      newOwner: newOwnerId,
      status: 'pending',
      expiresAt,
    });

    await transfer.save();
    return { message: 'Ownership transfer request sent successfully' };
  }

  async getPendingOwnershipTransfer(communityId: string, userId: string) {
    const community = await CommunityModel.findById(communityId);

    if (!community) {
      throw new Error(COMMUNITY_ERROR.NOT_FOUND);
    }

    // Check if user is a member of the community
    const member = community.members?.find((m: any) => m.user.toString() === userId);
    if (!member) {
      throw new Error(COMMUNITY_ERROR.NOT_MEMBER);
    }

    // Only founders and admins can view pending transfers
    if (!this.isFounder(community, userId) && !this.isAdmin(community, userId)) {
      throw new Error(COMMUNITY_ERROR.UNAUTHORIZED);
    }

    const transfer = await OwnershipTransferModel.findOne({
      community: communityId,
      status: 'pending',
    })
      .populate('currentOwner', 'name username')
      .populate('newOwner', 'name username avatar')
      .exec();

    if (!transfer) {
      return { transfer: null };
    }

    // Only return transfer data if user is the founder (who sent it) or the target (who should accept/reject it)
    const currentOwnerId = typeof transfer.currentOwner === 'object'
      ? (transfer.currentOwner as any)._id.toString()
      : (transfer.currentOwner as any)?.toString();
    const newOwnerId = typeof transfer.newOwner === 'object'
      ? (transfer.newOwner as any)._id.toString()
      : (transfer.newOwner as any)?.toString();

    if (userId !== currentOwnerId && userId !== newOwnerId) {
      return { transfer: null };
    }

    return {
      transfer: {
        id: transfer._id.toString(),
        fromUser: userId === newOwnerId ? {
          id: currentOwnerId,
          name: (transfer.currentOwner as any).name,
          username: (transfer.currentOwner as any).username,
        } : undefined,
        newOwner: userId === currentOwnerId ? {
          id: newOwnerId,
          name: (transfer.newOwner as any).name,
          username: (transfer.newOwner as any).username,
          avatar: (transfer.newOwner as any).avatar,
        } : undefined,
        expiresAt: transfer.expiresAt,
        createdAt: transfer.createdAt,
      }
    };
  }

  async getMyOwnershipTransferRequests(userId: string) {
    const transfers = await OwnershipTransferModel.find({
      newOwner: userId,
      status: 'pending',
    })
      .populate('community', 'name slug')
      .populate('currentOwner', 'name username')
      .sort({ createdAt: -1 })
      .exec();

    return transfers.map((transfer) => ({
      id: transfer._id.toString(),
      community: {
        id: (transfer.community as any)._id.toString(),
        name: (transfer.community as any).name,
        slug: (transfer.community as any).slug,
      },
      currentOwner: {
        id: (transfer.currentOwner as any)._id.toString(),
        name: (transfer.currentOwner as any).name,
        username: (transfer.currentOwner as any).username,
      },
      expiresAt: transfer.expiresAt,
      createdAt: transfer.createdAt,
    }));
  }

  async getMySentOwnershipTransferRequests(userId: string) {
    const transfers = await OwnershipTransferModel.find({
      currentOwner: userId,
      status: 'pending',
    })
      .populate('community', 'name slug')
      .populate('newOwner', 'name username avatar')
      .sort({ createdAt: -1 })
      .exec();

    return transfers.map((transfer) => ({
      id: transfer._id.toString(),
      community: {
        id: (transfer.community as any)._id.toString(),
        name: (transfer.community as any).name,
        slug: (transfer.community as any).slug,
      },
      newOwner: {
        id: (transfer.newOwner as any)._id.toString(),
        name: (transfer.newOwner as any).name,
        username: (transfer.newOwner as any).username,
        avatar: (transfer.newOwner as any).avatar,
      },
      expiresAt: transfer.expiresAt,
      createdAt: transfer.createdAt,
    }));
  }

  async cancelOwnershipTransfer(transferId: string, userId: string) {
    const transfer = await OwnershipTransferModel.findById(transferId);

    if (!transfer) {
      throw new Error(COMMUNITY_ERROR.OWNERSHIP_TRANSFER_NOT_FOUND);
    }

    const currentOwnerId = typeof transfer.currentOwner === 'string'
      ? transfer.currentOwner
      : transfer.currentOwner?.toString();

    if (currentOwnerId !== userId) {
      throw new Error(COMMUNITY_ERROR.UNAUTHORIZED);
    }

    await OwnershipTransferModel.findByIdAndUpdate(transferId, { status: 'cancelled' });
  }

  async acceptOwnershipTransfer(transferId: string, userId: string) {
    const transfer = await OwnershipTransferModel.findById(transferId);

    if (!transfer) {
      throw new Error(COMMUNITY_ERROR.OWNERSHIP_TRANSFER_NOT_FOUND);
    }

    if (transfer.status !== 'pending') {
      throw new Error(COMMUNITY_ERROR.OWNERSHIP_TRANSFER_ALREADY_USED);
    }

    if (new Date() > transfer.expiresAt) {
      throw new Error(COMMUNITY_ERROR.OWNERSHIP_TRANSFER_EXPIRED);
    }

    const newOwnerId = typeof transfer.newOwner === 'string'
      ? transfer.newOwner
      : transfer.newOwner?.toString();

    if (newOwnerId !== userId) {
      throw new Error(COMMUNITY_ERROR.UNAUTHORIZED);
    }

    const currentOwnerId = typeof transfer.currentOwner === 'string'
      ? transfer.currentOwner
      : transfer.currentOwner?.toString();

    const communityId = typeof transfer.community === 'string'
      ? transfer.community
      : transfer.community?.toString();

    if (!communityId) {
      throw new Error(COMMUNITY_ERROR.NOT_FOUND);
    }

    await OwnershipTransferModel.findByIdAndUpdate(transferId, { status: 'accepted' });


    await CommunityModel.findOneAndUpdate(
      { _id: communityId, 'members.user': currentOwnerId },
      { $set: { 'members.$.role': COMMUNITY_ROLE.ADMIN } }
    );

    await CommunityModel.findOneAndUpdate(
      { _id: communityId, 'members.user': newOwnerId },
      {
        $set: {
          'members.$.role': COMMUNITY_ROLE.FOUNDER,
        }
      }
    );

    // Update the founder field at the community level
    await CommunityModel.findByIdAndUpdate(
      communityId,
      { $set: { founder: newOwnerId } }
    );

    // Get updated community data
    const updatedCommunity = await this.getCommunityById(communityId, userId);

    // Check for pending join request
    let pendingRequestCommunityIds: string[] = [];
    const pendingRequest = await CommunityJoinRequestModel.findOne({
      user: userId,
      community: communityId,
      status: 'pending',
    });
    if (pendingRequest) {
      pendingRequestCommunityIds = [communityId];
    }

    return {
      message: 'Ownership transferred successfully',
      community: CommunityMapper.toSafeCommunity(updatedCommunity, userId, pendingRequestCommunityIds)
    };
  }

  async rejectOwnershipTransfer(transferId: string, userId: string) {
    const transfer = await OwnershipTransferModel.findById(transferId);

    if (!transfer) {
      throw new Error(COMMUNITY_ERROR.OWNERSHIP_TRANSFER_NOT_FOUND);
    }

    const newOwnerId = typeof transfer.newOwner === 'string'
      ? transfer.newOwner
      : transfer.newOwner?.toString();

    if (newOwnerId !== userId) {
      throw new Error(COMMUNITY_ERROR.UNAUTHORIZED);
    }

    await OwnershipTransferModel.findByIdAndUpdate(transferId, { status: 'rejected' });
  }

  private checkMembership(community: CommunityDoc, userId: string): boolean {
    return community.members?.some((m: any) => {
      const memberUserId = typeof m.user === 'string' ? m.user : m.user?.toString();
      return memberUserId === userId;
    }) || false;
  }

  async canAccessCommunity(communityId: string, userId?: string): Promise<{ canAccess: boolean; reason?: string }> {
    const community = await CommunityModel.findById(communityId).select('visibility members');

    if (!community) {
      return { canAccess: false, reason: 'Community not found' };
    }

    if (community.visibility === COMMUNITY_VISIBILITY.PUBLIC) {
      return { canAccess: true };
    }

    // For private communities, user must be authenticated and a member
    if (!userId) {
      return { canAccess: false, reason: 'You must be a member to view this private community' };
    }

    if (!this.checkMembership(community, userId)) {
      return { canAccess: false, reason: 'You must be a member to view this private community' };
    }

    return { canAccess: true };
  }

  async canViewCommunityPosts(communityId: string, userId?: string): Promise<{ canView: boolean; isMember: boolean; visibility: string }> {
    const community = await CommunityModel.findById(communityId).select('visibility members');

    if (!community) {
      return { canView: false, isMember: false, visibility: 'private' };
    }

    // Check if user is a member
    const isMember = userId ? this.checkMembership(community, userId) : false;

    // Private communities: only members can view posts
    if (community.visibility === COMMUNITY_VISIBILITY.PRIVATE) {
      return { canView: isMember, isMember, visibility: community.visibility };
    }

    // Public communities: members can view full content, non-members get blurred/masked preview
    return { canView: true, isMember, visibility: community.visibility };
  }

  async getMemberCommunityIds(userId: string): Promise<string[]> {
    const communities = await CommunityModel.find({
      'members.user': userId,
      isActive: true
    }).select('_id');

    return communities.map(c => c._id.toString());
  }

  async getMemberRole(communityId: string, userId: string): Promise<'founder' | 'admin' | 'member' | null> {
    const community = await CommunityModel.findById(communityId).select('members founder');

    if (!community) {
      return null;
    }

    if (community.founder?.toString() === userId) {
      return COMMUNITY_ROLE.FOUNDER;
    }

    const member = community.members.find((m: any) => m.user.toString() === userId);

    if (!member) {
      return null;
    }

    return member.role;
  }

  async incrementPostCount(communityId: string): Promise<void> {
    await CommunityModel.findByIdAndUpdate(communityId, { $inc: { postCount: 1 } });
  }

  async decrementPostCount(communityId: string, count: number = 1): Promise<void> {
    await CommunityModel.findByIdAndUpdate(communityId, { $inc: { postCount: -count } });
  }

  async validatePostPermission(communityId: string, userId: string): Promise<void> {
    const community = await CommunityModel.findById(communityId).select('isActive members allowMemberPosts');

    if (!community || !community.isActive) {
      throw new Error('Community not found or inactive');
    }

    const member = community.members?.find((m: any) => {
      const memberUserId = typeof m.user === 'string' ? m.user : m.user?.toString();
      return memberUserId === userId;
    });

    if (!member) {
      throw new Error('You must be a member of this community to post');
    }

    if (!community.allowMemberPosts && member.role !== COMMUNITY_ROLE.FOUNDER && member.role !== COMMUNITY_ROLE.ADMIN) {
      throw new Error('Only admins can post in this community');
    }
  }
}

export const communityService = new CommunityService();

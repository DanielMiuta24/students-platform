import { CommunityModel, type CommunityDoc, CommunityInvitationModel, CommunityJoinRequestModel, OwnershipTransferModel } from '../models';
import { categoryService } from '../../category/services';
import { imageService } from '../../image/services';

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
  async createCommunity(data: CreateCommunityDTO, coverImageFile?: UploadedFile): Promise<CommunityDoc> {
    const slug = toSlug(data.name);
    const slugExists = await CommunityModel.exists({ slug });
    if (slugExists) {
      throw new Error(COMMUNITY_ERROR.SLUG_EXISTS);
    }

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

  async getCommunityById(communityId: string, userId?: string): Promise<CommunityDoc> {
    const community = await CommunityModel.findById(communityId)
      .populate('founder', 'name username avatar')
      .populate('category', 'name slug')
      .populate('coverImage', 'url')
      .populate('members.user', 'name username avatar type')
      .exec();

    if (!community) {
      throw new Error(COMMUNITY_ERROR.NOT_FOUND);
    }

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

    let coverImageId: string | undefined;
    if (coverImageFile) {
      const uploadResult = await imageService.uploadImagesForPost([coverImageFile], userId);
      coverImageId = uploadResult[0]?.imageId;
    }

    const updateData = new CommunityUpdateBuilder()
      .fromDTO({ ...data, coverImage: coverImageId })
      .build();

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

    return {
      communities: CommunityMapper.toSafeCommunities(resultCommunities, userId),
      nextCursor,
      hasMore,
    };
  }

  async joinCommunity(communityId: string, userId: string): Promise<CommunityDoc> {
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

    if (community.requiresApproval) {
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

  async getCommunityMembers(communityId: string) {
    const community = await CommunityModel.findById(communityId)
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

  private isAdmin(community: CommunityDoc, userId: string): boolean {
    const founderId = typeof community.founder === 'string' ? community.founder : community.founder!.toString();

    if (founderId === userId) return true;

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
        invitations.push({
          community: communityId,
          invitedBy: userId,
          recipientUser: recipientUserId,
          status: 'pending',
          expiresAt,
        });
      }
    }

    if (invitations.length > 0) {
      await CommunityInvitationModel.insertMany(invitations);
    }

    return { invitationsSent: invitations.length };
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

    if (!this.isAdmin(community, userId)) {
      throw new Error(COMMUNITY_ERROR.NOT_ADMIN);
    }

    await CommunityInvitationModel.findByIdAndUpdate(invitationId, { status: 'cancelled' });
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

    await CommunityInvitationModel.findByIdAndUpdate(invitationId, { status: 'accepted' });

    return this.joinCommunity(invitation.community!.toString(), userId);
  }

  async createJoinRequest(communityId: string, userId: string, message?: string) {
    const community = await CommunityModel.findById(communityId);

    if (!community) {
      throw new Error(COMMUNITY_ERROR.NOT_FOUND);
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

    await CommunityJoinRequestModel.findByIdAndUpdate(requestId, { status: 'approved' });

    const requestUserId = typeof request.user === 'string' ? request.user : request.user!.toString();

    return this.joinCommunity(request.community!.toString(), requestUserId);
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

    await CommunityJoinRequestModel.findByIdAndUpdate(requestId, { status: 'rejected' });
  }

  async removeMember(communityId: string, memberId: string, userId: string) {
    const community = await CommunityModel.findById(communityId);

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

    await CommunityModel.findByIdAndUpdate(communityId, {
      $pull: { members: { user: memberId } },
      $inc: { memberCount: -1 },
    });
  }

  async banUser(communityId: string, userId: string, adminId: string) {
    const community = await CommunityModel.findById(communityId);

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

    await CommunityModel.findByIdAndUpdate(communityId, {
      $pull: { members: { user: userId } },
      $addToSet: { bannedUsers: userId },
      $inc: { memberCount: -1 },
    });
  }

  async unbanUser(communityId: string, userId: string, adminId: string) {
    const community = await CommunityModel.findById(communityId);

    if (!community) {
      throw new Error(COMMUNITY_ERROR.NOT_FOUND);
    }

    if (!this.isAdmin(community, adminId)) {
      throw new Error(COMMUNITY_ERROR.NOT_ADMIN);
    }

    await CommunityModel.findByIdAndUpdate(communityId, {
      $pull: { bannedUsers: userId },
    });
  }

  async updateMemberRole(communityId: string, memberId: string, role: 'admin' | 'member', adminId: string) {
    const community = await CommunityModel.findById(communityId);

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
      { _id: communityId, 'members.user': memberId },
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

    if (!this.isFounder(community, userId)) {
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
      return null;
    }

    return {
      id: transfer._id.toString(),
      newOwner: {
        id: (transfer.newOwner as any)._id.toString(),
        name: (transfer.newOwner as any).name,
        username: (transfer.newOwner as any).username,
        avatar: (transfer.newOwner as any).avatar,
      },
      expiresAt: transfer.expiresAt,
      createdAt: transfer.createdAt,
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
          founder: newOwnerId
        }
      }
    );

    return { message: 'Ownership transferred successfully' };
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

  async canAccessCommunity(communityId: string, userId: string): Promise<{ canAccess: boolean; reason?: string }> {
    const community = await CommunityModel.findById(communityId).select('visibility members');

    if (!community) {
      return { canAccess: false, reason: 'Community not found' };
    }

    if (community.visibility === COMMUNITY_VISIBILITY.PUBLIC) {
      return { canAccess: true };
    }

    if (!this.checkMembership(community, userId)) {
      return { canAccess: false, reason: 'You must be a member to view this private community' };
    }

    return { canAccess: true };
  }

  async getMemberCommunityIds(userId: string): Promise<string[]> {
    const communities = await CommunityModel.find({
      'members.user': userId,
      isActive: true
    }).select('_id');

    return communities.map(c => c._id.toString());
  }

  async incrementPostCount(communityId: string): Promise<void> {
    await CommunityModel.findByIdAndUpdate(communityId, { $inc: { postCount: 1 } });
  }

  async decrementPostCount(communityId: string): Promise<void> {
    await CommunityModel.findByIdAndUpdate(communityId, { $inc: { postCount: -1 } });
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

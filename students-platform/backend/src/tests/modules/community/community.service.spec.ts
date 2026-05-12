import { CommunityModel, CommunityInvitationModel, CommunityJoinRequestModel, OwnershipTransferModel } from '../../../modules/community/models';
import { CategoryModel } from '../../../modules/category/models';
import { imageService } from '../../../modules/image/services';
import { communityService } from '../../../modules/community/services';
import { COMMUNITY_ERROR, COMMUNITY_ROLE } from '../../../modules/community/constants';

jest.mock('../../../modules/community/models');
jest.mock('../../../modules/category/models');
jest.mock('../../../modules/image/services');
jest.mock('../../../modules/post/services', () => ({
  postService: {
    deletePostsByCommunity: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('CommunityService', () => {
  const mockFounderId = 'founder123';
  const mockUserId = 'user456';
  const mockCommunityId = 'comm789';
  const mockCategoryId = 'cat123';

  const mockCommunity = {
    _id: mockCommunityId,
    name: 'Study Group',
    slug: 'study-group',
    description: 'A study community',
    category: mockCategoryId,
    founder: mockFounderId,
    members: [
      { user: mockFounderId, role: COMMUNITY_ROLE.FOUNDER, joinedAt: new Date() }
    ],
    bannedUsers: [],
    memberCount: 1,
    postCount: 0,
    isActive: true,
    requiresApproval: false,
    allowMemberPosts: true,
    allowMemberInvites: true,
    save: jest.fn().mockResolvedValue(this),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createCommunity', () => {
    const createData = {
      name: 'Study Group',
      description: 'A study community',
      category: mockCategoryId,
      founderId: mockFounderId,
    };

    it('should create community successfully', async () => {
      (CommunityModel.exists as jest.Mock).mockResolvedValue(null);
      (CategoryModel.findOne as jest.Mock).mockResolvedValue({ _id: mockCategoryId, isActive: true });
      (CommunityModel as any).mockImplementation(() => mockCommunity);

      const result = await communityService.createCommunity(createData);

      expect(CommunityModel.exists).toHaveBeenCalledWith({ slug: 'study-group' });
      expect(CategoryModel.findOne).toHaveBeenCalled();
      expect(mockCommunity.save).toHaveBeenCalled();
    });

    it('should throw error when slug already exists', async () => {
      (CommunityModel.exists as jest.Mock).mockResolvedValue(true);

      await expect(communityService.createCommunity(createData)).rejects.toThrow(COMMUNITY_ERROR.SLUG_EXISTS);
    });

    it('should throw error when category not found', async () => {
      (CommunityModel.exists as jest.Mock).mockResolvedValue(null);
      (CategoryModel.findOne as jest.Mock).mockResolvedValue(null);

      await expect(communityService.createCommunity(createData)).rejects.toThrow(COMMUNITY_ERROR.CATEGORY_NOT_FOUND);
    });

    it('should upload cover image if provided', async () => {
      const mockFile = { stream: {} } as any;
      const mockUploadResult = [{ imageId: 'img123' }];

      (CommunityModel.exists as jest.Mock).mockResolvedValue(null);
      (CategoryModel.findOne as jest.Mock).mockResolvedValue({ _id: mockCategoryId, isActive: true });
      (imageService.uploadImagesForPost as jest.Mock).mockResolvedValue(mockUploadResult);
      (CommunityModel as any).mockImplementation(() => mockCommunity);

      await communityService.createCommunity(createData, mockFile);

      expect(imageService.uploadImagesForPost).toHaveBeenCalledWith([mockFile], mockFounderId);
    });
  });

  describe('getCommunityById', () => {
    it('should return community when found', async () => {
      (CommunityModel.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockCommunity),
      });

      const result = await communityService.getCommunityById(mockCommunityId);

      expect(CommunityModel.findById).toHaveBeenCalledWith(mockCommunityId);
      expect(result).toEqual(mockCommunity);
    });

    it('should throw error when community not found', async () => {
      (CommunityModel.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(communityService.getCommunityById(mockCommunityId)).rejects.toThrow(COMMUNITY_ERROR.NOT_FOUND);
    });
  });

  describe('updateCommunity', () => {
    const updateData = { description: 'Updated description' };

    it('should update community successfully', async () => {
      (CommunityModel.findById as jest.Mock).mockResolvedValue(mockCommunity);
      (CommunityModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue({ ...mockCommunity, ...updateData }),
      });

      const result = await communityService.updateCommunity(mockCommunityId, updateData, mockFounderId);

      expect(CommunityModel.findByIdAndUpdate).toHaveBeenCalled();
    });

    it('should throw error when user is not admin', async () => {
      (CommunityModel.findById as jest.Mock).mockResolvedValue(mockCommunity);

      await expect(communityService.updateCommunity(mockCommunityId, updateData, 'otherUser')).rejects.toThrow(COMMUNITY_ERROR.NOT_ADMIN);
    });

    it('should update slug when name changes', async () => {
      const nameUpdate = { name: 'New Name' };
      (CommunityModel.findById as jest.Mock).mockResolvedValue(mockCommunity);
      (CommunityModel.exists as jest.Mock).mockResolvedValue(null);
      (CommunityModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockCommunity),
      });

      await communityService.updateCommunity(mockCommunityId, nameUpdate, mockFounderId);

      expect(CommunityModel.exists).toHaveBeenCalled();
    });
  });

  describe('deleteCommunity', () => {
    it('should delete community successfully', async () => {
      (CommunityModel.findById as jest.Mock).mockResolvedValue(mockCommunity);
      (CommunityModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockCommunity);
      (CommunityInvitationModel.deleteMany as jest.Mock).mockResolvedValue({});
      (CommunityJoinRequestModel.deleteMany as jest.Mock).mockResolvedValue({});
      (OwnershipTransferModel.deleteMany as jest.Mock).mockResolvedValue({});

      await communityService.deleteCommunity(mockCommunityId, mockFounderId);

      expect(CommunityModel.findByIdAndDelete).toHaveBeenCalledWith(mockCommunityId);
      expect(CommunityInvitationModel.deleteMany).toHaveBeenCalledWith({ community: mockCommunityId });
      expect(CommunityJoinRequestModel.deleteMany).toHaveBeenCalledWith({ community: mockCommunityId });
      expect(OwnershipTransferModel.deleteMany).toHaveBeenCalledWith({ community: mockCommunityId });
    });

    it('should throw error when user is not founder', async () => {
      (CommunityModel.findById as jest.Mock).mockResolvedValue(mockCommunity);

      await expect(communityService.deleteCommunity(mockCommunityId, 'otherUser')).rejects.toThrow(COMMUNITY_ERROR.UNAUTHORIZED);
    });
  });

  describe('joinCommunity', () => {
    it('should join community successfully', async () => {
      const communityWithoutUser = { ...mockCommunity, members: [mockCommunity.members[0]] };
      (CommunityModel.findById as jest.Mock).mockResolvedValue(communityWithoutUser);
      (CommunityModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(communityWithoutUser),
      });

      await communityService.joinCommunity(mockCommunityId, mockUserId);

      expect(CommunityModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockCommunityId,
        expect.objectContaining({
          $push: expect.any(Object),
          $inc: { memberCount: 1 },
        }),
        expect.any(Object)
      );
    });

    it('should throw error when user is already member', async () => {
      const communityWithUser = {
        ...mockCommunity,
        members: [
          mockCommunity.members[0],
          { user: mockUserId, role: COMMUNITY_ROLE.MEMBER, joinedAt: new Date() }
        ]
      };
      (CommunityModel.findById as jest.Mock).mockResolvedValue(communityWithUser);

      await expect(communityService.joinCommunity(mockCommunityId, mockUserId)).rejects.toThrow(COMMUNITY_ERROR.ALREADY_MEMBER);
    });

    it('should throw error when user is banned', async () => {
      const communityWithBan = { ...mockCommunity, bannedUsers: [mockUserId] };
      (CommunityModel.findById as jest.Mock).mockResolvedValue(communityWithBan);

      await expect(communityService.joinCommunity(mockCommunityId, mockUserId)).rejects.toThrow(COMMUNITY_ERROR.USER_BANNED);
    });

    it('should throw error when approval is required', async () => {
      const communityWithApproval = { ...mockCommunity, requiresApproval: true };
      (CommunityModel.findById as jest.Mock).mockResolvedValue(communityWithApproval);

      await expect(communityService.joinCommunity(mockCommunityId, mockUserId)).rejects.toThrow(COMMUNITY_ERROR.REQUIRES_APPROVAL);
    });
  });

  describe('leaveCommunity', () => {
    it('should leave community successfully', async () => {
      const communityWithUser = {
        ...mockCommunity,
        members: [
          mockCommunity.members[0],
          { user: mockUserId, role: COMMUNITY_ROLE.MEMBER, joinedAt: new Date() }
        ]
      };
      (CommunityModel.findById as jest.Mock).mockResolvedValue(communityWithUser);
      (CommunityModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({});

      await communityService.leaveCommunity(mockCommunityId, mockUserId);

      expect(CommunityModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockCommunityId,
        expect.objectContaining({
          $pull: expect.any(Object),
          $inc: { memberCount: -1 },
        })
      );
    });

    it('should throw error when founder tries to leave', async () => {
      (CommunityModel.findById as jest.Mock).mockResolvedValue(mockCommunity);

      await expect(communityService.leaveCommunity(mockCommunityId, mockFounderId)).rejects.toThrow(COMMUNITY_ERROR.CANNOT_LEAVE_AS_FOUNDER);
    });

    it('should throw error when user is not member', async () => {
      (CommunityModel.findById as jest.Mock).mockResolvedValue(mockCommunity);

      await expect(communityService.leaveCommunity(mockCommunityId, mockUserId)).rejects.toThrow(COMMUNITY_ERROR.NOT_MEMBER);
    });
  });

  describe('sendInvitations', () => {
    it('should send email invitations', async () => {
      (CommunityModel.findById as jest.Mock).mockResolvedValue(mockCommunity);
      (CommunityInvitationModel.insertMany as jest.Mock).mockResolvedValue([]);

      const result = await communityService.sendInvitations(mockCommunityId, mockFounderId, {
        emails: ['test@example.com']
      });

      expect(CommunityInvitationModel.insertMany).toHaveBeenCalled();
      expect(result.invitationsSent).toBe(1);
    });

    it('should send user invitations', async () => {
      (CommunityModel.findById as jest.Mock).mockResolvedValue(mockCommunity);
      (CommunityInvitationModel.insertMany as jest.Mock).mockResolvedValue([]);

      const result = await communityService.sendInvitations(mockCommunityId, mockFounderId, {
        userIds: [mockUserId]
      });

      expect(result.invitationsSent).toBe(1);
    });
  });

  describe('createJoinRequest', () => {
    it('should create join request when approval required', async () => {
      const communityWithApproval = { ...mockCommunity, requiresApproval: true };
      (CommunityModel.findById as jest.Mock).mockResolvedValue(communityWithApproval);
      (CommunityJoinRequestModel.findOne as jest.Mock).mockResolvedValue(null);
      (CommunityJoinRequestModel as any).mockImplementation(() => ({
        save: jest.fn().mockResolvedValue({}),
      }));

      await communityService.createJoinRequest(mockCommunityId, mockUserId);

      expect(CommunityJoinRequestModel).toHaveBeenCalled();
    });

    it('should throw error when request already exists', async () => {
      const communityWithApproval = { ...mockCommunity, requiresApproval: true };
      (CommunityModel.findById as jest.Mock).mockResolvedValue(communityWithApproval);
      (CommunityJoinRequestModel.findOne as jest.Mock).mockResolvedValue({ _id: 'req123' });

      await expect(communityService.createJoinRequest(mockCommunityId, mockUserId)).rejects.toThrow(COMMUNITY_ERROR.JOIN_REQUEST_EXISTS);
    });
  });

  describe('removeMember', () => {
    it('should remove member successfully', async () => {
      const adminUser = 'admin456';
      const communityWithAdmin = {
        ...mockCommunity,
        members: [
          mockCommunity.members[0],
          { user: adminUser, role: COMMUNITY_ROLE.ADMIN, joinedAt: new Date() },
          { user: mockUserId, role: COMMUNITY_ROLE.MEMBER, joinedAt: new Date() }
        ]
      };
      (CommunityModel.findById as jest.Mock).mockResolvedValue(communityWithAdmin);
      (CommunityModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({});

      await communityService.removeMember(mockCommunityId, mockUserId, adminUser);

      expect(CommunityModel.findByIdAndUpdate).toHaveBeenCalled();
    });

    it('should throw error when trying to remove founder', async () => {
      (CommunityModel.findById as jest.Mock).mockResolvedValue(mockCommunity);

      await expect(communityService.removeMember(mockCommunityId, mockFounderId, mockFounderId)).rejects.toThrow(COMMUNITY_ERROR.CANNOT_REMOVE_FOUNDER);
    });
  });

  describe('banUser', () => {
    it('should ban user successfully', async () => {
      const communityWithUser = {
        ...mockCommunity,
        members: [
          mockCommunity.members[0],
          { user: mockUserId, role: COMMUNITY_ROLE.MEMBER, joinedAt: new Date() }
        ]
      };
      (CommunityModel.findById as jest.Mock).mockResolvedValue(communityWithUser);
      (CommunityModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({});

      await communityService.banUser(mockCommunityId, mockUserId, mockFounderId);

      expect(CommunityModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockCommunityId,
        expect.objectContaining({
          $pull: expect.any(Object),
          $addToSet: { bannedUsers: mockUserId },
          $inc: { memberCount: -1 },
        })
      );
    });

    it('should throw error when trying to ban admin', async () => {
      const adminUser = 'admin456';
      const communityWithAdmin = {
        ...mockCommunity,
        members: [
          mockCommunity.members[0],
          { user: adminUser, role: COMMUNITY_ROLE.ADMIN, joinedAt: new Date() }
        ]
      };
      (CommunityModel.findById as jest.Mock).mockResolvedValue(communityWithAdmin);

      await expect(communityService.banUser(mockCommunityId, adminUser, mockFounderId)).rejects.toThrow(COMMUNITY_ERROR.CANNOT_BAN_ADMIN);
    });
  });

  describe('updateMemberRole', () => {
    it('should update member role successfully', async () => {
      const communityWithUser = {
        ...mockCommunity,
        members: [
          mockCommunity.members[0],
          { user: mockUserId, role: COMMUNITY_ROLE.MEMBER, joinedAt: new Date() }
        ]
      };
      (CommunityModel.findById as jest.Mock).mockResolvedValue(communityWithUser);
      (CommunityModel.findOneAndUpdate as jest.Mock).mockResolvedValue({});

      await communityService.updateMemberRole(mockCommunityId, mockUserId, COMMUNITY_ROLE.ADMIN, mockFounderId);

      expect(CommunityModel.findOneAndUpdate).toHaveBeenCalled();
    });

    it('should throw error when non-founder tries to update role', async () => {
      const communityWithUser = {
        ...mockCommunity,
        members: [
          mockCommunity.members[0],
          { user: mockUserId, role: COMMUNITY_ROLE.MEMBER, joinedAt: new Date() }
        ]
      };
      (CommunityModel.findById as jest.Mock).mockResolvedValue(communityWithUser);

      await expect(communityService.updateMemberRole(mockCommunityId, mockUserId, COMMUNITY_ROLE.ADMIN, mockUserId)).rejects.toThrow(COMMUNITY_ERROR.UNAUTHORIZED);
    });
  });

  describe('requestOwnershipTransfer', () => {
    it('should request ownership transfer successfully', async () => {
      const communityWithUser = {
        ...mockCommunity,
        members: [
          mockCommunity.members[0],
          { user: mockUserId, role: COMMUNITY_ROLE.MEMBER, joinedAt: new Date() }
        ]
      };
      (CommunityModel.findById as jest.Mock).mockResolvedValue(communityWithUser);
      (OwnershipTransferModel.findOne as jest.Mock).mockResolvedValue(null);
      (OwnershipTransferModel.prototype.save as jest.Mock).mockResolvedValue({});

      const result = await communityService.requestOwnershipTransfer(mockCommunityId, mockUserId, mockFounderId);

      expect(result.message).toBe('Ownership transfer request sent successfully');
    });

    it('should throw error when new owner is not member', async () => {
      (CommunityModel.findById as jest.Mock).mockResolvedValue(mockCommunity);

      await expect(communityService.requestOwnershipTransfer(mockCommunityId, 'nonmember', mockFounderId)).rejects.toThrow(COMMUNITY_ERROR.NOT_MEMBER);
    });

    it('should throw error when non-founder tries to transfer', async () => {
      (CommunityModel.findById as jest.Mock).mockResolvedValue(mockCommunity);

      await expect(communityService.requestOwnershipTransfer(mockCommunityId, mockUserId, 'otherUser')).rejects.toThrow(COMMUNITY_ERROR.UNAUTHORIZED);
    });
  });
});

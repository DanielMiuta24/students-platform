import { communityController } from '../../../modules/community/controllers';
import { communityService } from '../../../modules/community/services';
import { CommunityMapper } from '../../../modules/community/mappers';
import { COMMUNITY_ERROR } from '../../../modules/community/constants';

jest.mock('../../../modules/community/services');
jest.mock('../../../modules/community/mappers');

describe('CommunityController', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: any;

  const mockUser = { id: 'user123', email: 'test@example.com' };
  const mockCommunity = { _id: 'comm123', name: 'Study Group' };

  beforeEach(() => {
    mockReq = {
      user: mockUser,
      params: {},
      query: {},
      body: {},
      files: [],
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('createCommunity', () => {
    it('should create community successfully', async () => {
      mockReq.body = {
        name: 'Study Group',
        description: 'A study community',
        category: 'cat123',
      };

      (communityService.createCommunity as jest.Mock).mockResolvedValue(mockCommunity);
      (CommunityMapper.toSafeCommunity as jest.Mock).mockReturnValue(mockCommunity);

      await communityController.createCommunity(mockReq, mockRes, mockNext);

      expect(communityService.createCommunity).toHaveBeenCalledWith(
        expect.objectContaining({ founderId: mockUser.id }),
        undefined
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Community created successfully' })
      );
    });

    it('should handle cover image upload', async () => {
      mockReq.body = { name: 'Study Group', description: 'Test', category: 'cat123' };
      mockReq.files = [{ stream: {} }];

      (communityService.createCommunity as jest.Mock).mockResolvedValue(mockCommunity);
      (CommunityMapper.toSafeCommunity as jest.Mock).mockReturnValue(mockCommunity);

      await communityController.createCommunity(mockReq, mockRes, mockNext);

      expect(communityService.createCommunity).toHaveBeenCalledWith(
        expect.any(Object),
        mockReq.files[0]
      );
    });

    it('should handle errors', async () => {
      (communityService.createCommunity as jest.Mock).mockRejectedValue(
        new Error(COMMUNITY_ERROR.SLUG_EXISTS)
      );

      await communityController.createCommunity(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.any(String) })
      );
    });
  });

  describe('getCommunityById', () => {
    it('should return community', async () => {
      mockReq.params.id = 'comm123';

      (communityService.getCommunityById as jest.Mock).mockResolvedValue(mockCommunity);
      (CommunityMapper.toSafeCommunity as jest.Mock).mockReturnValue(mockCommunity);

      await communityController.getCommunityById(mockReq, mockRes, mockNext);

      expect(communityService.getCommunityById).toHaveBeenCalledWith('comm123', mockUser.id);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ community: mockCommunity })
      );
    });

    it('should handle not found', async () => {
      mockReq.params.id = 'nonexistent';

      (communityService.getCommunityById as jest.Mock).mockRejectedValue(
        new Error(COMMUNITY_ERROR.NOT_FOUND)
      );

      await communityController.getCommunityById(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });
  });

  describe('updateCommunity', () => {
    it('should update community successfully', async () => {
      mockReq.params.id = 'comm123';
      mockReq.body = { description: 'Updated' };

      (communityService.updateCommunity as jest.Mock).mockResolvedValue(mockCommunity);
      (CommunityMapper.toSafeCommunity as jest.Mock).mockReturnValue(mockCommunity);

      await communityController.updateCommunity(mockReq, mockRes, mockNext);

      expect(communityService.updateCommunity).toHaveBeenCalledWith(
        'comm123',
        mockReq.body,
        mockUser.id,
        undefined
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should handle unauthorized', async () => {
      mockReq.params.id = 'comm123';

      (communityService.updateCommunity as jest.Mock).mockRejectedValue(
        new Error(COMMUNITY_ERROR.NOT_ADMIN)
      );

      await communityController.updateCommunity(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
    });
  });

  describe('deleteCommunity', () => {
    it('should delete community successfully', async () => {
      mockReq.params.id = 'comm123';

      (communityService.deleteCommunity as jest.Mock).mockResolvedValue(undefined);

      await communityController.deleteCommunity(mockReq, mockRes, mockNext);

      expect(communityService.deleteCommunity).toHaveBeenCalledWith('comm123', mockUser.id);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Community deleted successfully' })
      );
    });
  });

  describe('getCommunities', () => {
    it('should return communities list', async () => {
      mockReq.query = { cursor: 'comm123', limit: '10', category: 'cat123' };

      const mockResult = {
        communities: [mockCommunity],
        nextCursor: null,
        hasMore: false,
      };

      (communityService.getCommunities as jest.Mock).mockResolvedValue(mockResult);

      await communityController.getCommunities(mockReq, mockRes, mockNext);

      expect(communityService.getCommunities).toHaveBeenCalledWith(
        expect.objectContaining({
          cursor: 'comm123',
          limit: 10,
          category: 'cat123',
        }),
        mockUser.id
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('joinCommunity', () => {
    it('should join community successfully', async () => {
      mockReq.params.id = 'comm123';

      (communityService.joinCommunity as jest.Mock).mockResolvedValue(mockCommunity);
      (CommunityMapper.toSafeCommunity as jest.Mock).mockReturnValue(mockCommunity);

      await communityController.joinCommunity(mockReq, mockRes, mockNext);

      expect(communityService.joinCommunity).toHaveBeenCalledWith('comm123', mockUser.id);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Successfully joined community' })
      );
    });

    it('should handle already member error', async () => {
      mockReq.params.id = 'comm123';

      (communityService.joinCommunity as jest.Mock).mockRejectedValue(
        new Error(COMMUNITY_ERROR.ALREADY_MEMBER)
      );

      await communityController.joinCommunity(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(409);
    });
  });

  describe('leaveCommunity', () => {
    it('should leave community successfully', async () => {
      mockReq.params.id = 'comm123';

      (communityService.leaveCommunity as jest.Mock).mockResolvedValue(undefined);

      await communityController.leaveCommunity(mockReq, mockRes, mockNext);

      expect(communityService.leaveCommunity).toHaveBeenCalledWith('comm123', mockUser.id);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('sendInvitations', () => {
    it('should send invitations successfully', async () => {
      mockReq.params.id = 'comm123';
      mockReq.body = { emails: ['test@example.com'], userIds: ['user456'] };

      (communityService.sendInvitations as jest.Mock).mockResolvedValue({
        invitationsSent: 2,
      });

      await communityController.sendInvitations(mockReq, mockRes, mockNext);

      expect(communityService.sendInvitations).toHaveBeenCalledWith(
        'comm123',
        mockUser.id,
        mockReq.body
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });
  });

  describe('acceptInvitation', () => {
    it('should accept invitation successfully', async () => {
      mockReq.params.invitationId = 'inv123';

      (communityService.acceptInvitation as jest.Mock).mockResolvedValue(mockCommunity);
      (CommunityMapper.toSafeCommunity as jest.Mock).mockReturnValue(mockCommunity);

      await communityController.acceptInvitation(mockReq, mockRes, mockNext);

      expect(communityService.acceptInvitation).toHaveBeenCalledWith('inv123', mockUser.id);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('createJoinRequest', () => {
    it('should create join request successfully', async () => {
      mockReq.params.id = 'comm123';
      mockReq.body = { message: 'Please let me join' };

      (communityService.createJoinRequest as jest.Mock).mockResolvedValue({
        message: 'Join request submitted successfully',
      });

      await communityController.createJoinRequest(mockReq, mockRes, mockNext);

      expect(communityService.createJoinRequest).toHaveBeenCalledWith(
        'comm123',
        mockUser.id,
        'Please let me join'
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });
  });

  describe('approveJoinRequest', () => {
    it('should approve join request successfully', async () => {
      mockReq.params.requestId = 'req123';

      (communityService.approveJoinRequest as jest.Mock).mockResolvedValue(mockCommunity);
      (CommunityMapper.toSafeCommunity as jest.Mock).mockReturnValue(mockCommunity);

      await communityController.approveJoinRequest(mockReq, mockRes, mockNext);

      expect(communityService.approveJoinRequest).toHaveBeenCalledWith('req123', mockUser.id);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('removeMember', () => {
    it('should remove member successfully', async () => {
      mockReq.params = { id: 'comm123', memberId: 'user456' };

      (communityService.removeMember as jest.Mock).mockResolvedValue(undefined);

      await communityController.removeMember(mockReq, mockRes, mockNext);

      expect(communityService.removeMember).toHaveBeenCalledWith(
        'comm123',
        'user456',
        mockUser.id
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('banUser', () => {
    it('should ban user successfully', async () => {
      mockReq.params = { id: 'comm123', memberId: 'user456' };

      (communityService.banUser as jest.Mock).mockResolvedValue(undefined);

      await communityController.banUser(mockReq, mockRes, mockNext);

      expect(communityService.banUser).toHaveBeenCalledWith('comm123', 'user456', mockUser.id);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('updateMemberRole', () => {
    it('should update member role successfully', async () => {
      mockReq.params = { id: 'comm123', memberId: 'user456' };
      mockReq.body = { role: 'admin' };

      (communityService.updateMemberRole as jest.Mock).mockResolvedValue(undefined);

      await communityController.updateMemberRole(mockReq, mockRes, mockNext);

      expect(communityService.updateMemberRole).toHaveBeenCalledWith(
        'comm123',
        'user456',
        'admin',
        mockUser.id
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('requestOwnershipTransfer', () => {
    it('should request ownership transfer successfully', async () => {
      mockReq.params.id = 'comm123';
      mockReq.body = { newOwnerId: 'user456' };

      (communityService.requestOwnershipTransfer as jest.Mock).mockResolvedValue({ message: 'Ownership transfer request sent successfully' });

      await communityController.requestOwnershipTransfer(mockReq, mockRes, mockNext);

      expect(communityService.requestOwnershipTransfer).toHaveBeenCalledWith(
        'comm123',
        'user456',
        mockUser.id
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Ownership transfer request sent successfully' })
      );
    });
  });
});

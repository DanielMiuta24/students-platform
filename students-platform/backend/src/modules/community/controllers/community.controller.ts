import type { Request, Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../../../shared/middleware/auth.middleware';
import { communityService } from '../services';
import { CommunityMapper } from '../mappers';
import { COMMUNITY_ERROR } from '../constants';
import { parseCursorParams } from '../validators';
import type { UploadRequest } from '../../image/services';
import { CommunityJoinRequestModel, CommunityInvitationModel } from '../models';

class CommunityController {
  private static readonly HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NOT_FOUND: 404,
    FORBIDDEN: 403,
    CONFLICT: 409,
    BAD_REQUEST: 400,
  } as const;

  private static readonly ERROR_RESPONSES: Record<string, { status: number; message: string }> = {
    [COMMUNITY_ERROR.NOT_FOUND]: {
      status: 404,
      message: 'Community not found',
    },
    [COMMUNITY_ERROR.UNAUTHORIZED]: {
      status: 403,
      message: 'You are not authorized to perform this action',
    },
    [COMMUNITY_ERROR.NOT_ADMIN]: {
      status: 403,
      message: 'Only community admins can perform this action',
    },
    [COMMUNITY_ERROR.SLUG_EXISTS]: {
      status: 409,
      message: 'A community with a similar name already exists. Please choose a different name.',
    },
    [COMMUNITY_ERROR.CATEGORY_NOT_FOUND]: {
      status: 404,
      message: 'Category not found or inactive',
    },
    [COMMUNITY_ERROR.ALREADY_MEMBER]: {
      status: 409,
      message: 'You are already a member of this community',
    },
    [COMMUNITY_ERROR.NOT_MEMBER]: {
      status: 400,
      message: 'You are not a member of this community',
    },
    [COMMUNITY_ERROR.CANNOT_LEAVE_AS_FOUNDER]: {
      status: 403,
      message: 'Community founder cannot leave the community',
    },
    [COMMUNITY_ERROR.USER_BANNED]: {
      status: 403,
      message: 'You are banned from this community',
    },
    [COMMUNITY_ERROR.INVITATION_NOT_FOUND]: {
      status: 404,
      message: 'Invitation not found',
    },
    [COMMUNITY_ERROR.INVITATION_EXPIRED]: {
      status: 400,
      message: 'This invitation has expired',
    },
    [COMMUNITY_ERROR.INVITATION_ALREADY_USED]: {
      status: 400,
      message: 'This invitation has already been used',
    },
    [COMMUNITY_ERROR.JOIN_REQUEST_NOT_FOUND]: {
      status: 404,
      message: 'Join request not found',
    },
    [COMMUNITY_ERROR.JOIN_REQUEST_EXISTS]: {
      status: 409,
      message: 'You already have a pending join request',
    },
    [COMMUNITY_ERROR.CANNOT_REMOVE_FOUNDER]: {
      status: 403,
      message: 'Cannot remove the community founder',
    },
    [COMMUNITY_ERROR.CANNOT_BAN_ADMIN]: {
      status: 403,
      message: 'Cannot ban community admins',
    },
    [COMMUNITY_ERROR.REQUIRES_APPROVAL]: {
      status: 400,
      message: 'This community requires approval to join. Please submit a join request.',
    },
  };

  private handleError(err: unknown, res: Response, next: NextFunction): Response | void {
    if (!(err instanceof Error)) {
      return next(err);
    }

    const errorResponse = CommunityController.ERROR_RESPONSES[err.message];

    if (!errorResponse) {
      return next(err);
    }

    return res.status(errorResponse.status).json({
      message: errorResponse.message,
    });
  }

  createCommunity = async (
    req: AuthenticatedRequest & UploadRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const coverImageFile = req.files?.[0];
      const community = await communityService.createCommunity(
        {
          ...req.body,
          founderId: req.user!.id,
        },
        coverImageFile
      );

      return res.status(CommunityController.HTTP_STATUS.CREATED).json({
        message: 'Community created successfully',
        community: CommunityMapper.toSafeCommunity(community, req.user!.id),
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  getCommunityById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = (req as AuthenticatedRequest).user?.id;
      const community = await communityService.getCommunityById(req.params.id, userId);

      let pendingRequestCommunityIds: string[] = [];
      let pendingInvitationCommunityIds: string[] = [];

      if (userId) {
        const [pendingRequest, pendingInvitation] = await Promise.all([
          CommunityJoinRequestModel.findOne({
            user: userId,
            community: community._id,
            status: 'pending',
          }),
          CommunityInvitationModel.findOne({
            recipientUser: userId,
            community: community._id,
            status: 'pending',
            expiresAt: { $gt: new Date() },
          })
        ]);

        if (pendingRequest) {
          pendingRequestCommunityIds = [community._id.toString()];
        }
        if (pendingInvitation) {
          pendingInvitationCommunityIds = [community._id.toString()];
        }
      }

      return res.status(CommunityController.HTTP_STATUS.OK).json({
        community: CommunityMapper.toSafeCommunity(community, userId, pendingRequestCommunityIds, pendingInvitationCommunityIds),
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  canViewCommunityPosts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = (req as AuthenticatedRequest).user?.id;
      const result = await communityService.canViewCommunityPosts(req.params.id, userId);

      return res.status(CommunityController.HTTP_STATUS.OK).json(result);
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  updateCommunity = async (
    req: AuthenticatedRequest & UploadRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const coverImageFile = req.files?.[0];
      const community = await communityService.updateCommunity(
        req.params.id,
        req.body,
        req.user!.id,
        coverImageFile
      );

      return res.status(CommunityController.HTTP_STATUS.OK).json({
        message: 'Community updated successfully',
        community: CommunityMapper.toSafeCommunity(community, req.user!.id),
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  deleteCommunity = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await communityService.deleteCommunity(req.params.id, req.user!.id);

      return res.status(CommunityController.HTTP_STATUS.OK).json({
        message: 'Community deleted successfully',
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  getCommunities = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { cursor, limit } = parseCursorParams(
        req.query.cursor as string,
        req.query.limit as string
      );

      const userId = (req as AuthenticatedRequest).user?.id;

      const result = await communityService.getCommunities(
        {
          cursor,
          limit,
          category: req.query.category as string,
          search: req.query.search as string,
          founderId: req.query.founderId as string,
        },
        userId
      );

      return res.status(CommunityController.HTTP_STATUS.OK).json(result);
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  joinCommunity = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const community = await communityService.joinCommunity(
        req.params.id,
        req.user!.id
      );

      return res.status(CommunityController.HTTP_STATUS.OK).json({
        message: 'Successfully joined community',
        community: CommunityMapper.toSafeCommunity(community, req.user!.id),
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  leaveCommunity = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await communityService.leaveCommunity(req.params.id, req.user!.id);

      return res.status(CommunityController.HTTP_STATUS.OK).json({
        message: 'Successfully left community',
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  getCommunityMembers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await communityService.getCommunityMembers(req.params.id);

      return res.status(CommunityController.HTTP_STATUS.OK).json(result);
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  sendInvitations = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await communityService.sendInvitations(
        req.params.id,
        req.user!.id,
        req.body
      );

      return res.status(CommunityController.HTTP_STATUS.CREATED).json({
        message: 'Invitations sent successfully',
        ...result,
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  getInvitations = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const invitations = await communityService.getInvitations(
        req.params.id,
        req.user!.id
      );

      return res.status(CommunityController.HTTP_STATUS.OK).json({
        invitations,
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  cancelInvitation = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await communityService.cancelInvitation(req.params.invitationId, req.user!.id);

      return res.status(CommunityController.HTTP_STATUS.OK).json({
        message: 'Invitation cancelled successfully',
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  acceptInvitation = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const community = await communityService.acceptInvitation(
        req.params.invitationId,
        req.user!.id
      );

      return res.status(CommunityController.HTTP_STATUS.OK).json({
        message: 'Invitation accepted successfully',
        community: CommunityMapper.toSafeCommunity(community, req.user!.id),
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  getMyInvitations = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const invitations = await communityService.getMyInvitations(req.user!.id);

      return res.status(CommunityController.HTTP_STATUS.OK).json(invitations);
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  getMySentInvitations = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const invitations = await communityService.getMySentInvitations(req.user!.id);

      return res.status(CommunityController.HTTP_STATUS.OK).json(invitations);
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  createJoinRequest = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await communityService.createJoinRequest(
        req.params.id,
        req.user!.id,
        req.body.message
      );

      return res.status(CommunityController.HTTP_STATUS.CREATED).json(result);
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  cancelJoinRequest = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await communityService.cancelJoinRequest(
        req.params.id,
        req.user!.id
      );

      return res.status(CommunityController.HTTP_STATUS.OK).json(result);
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  getJoinRequests = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const requests = await communityService.getJoinRequests(
        req.params.id,
        req.user!.id
      );

      return res.status(CommunityController.HTTP_STATUS.OK).json({
        requests,
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  approveJoinRequest = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const community = await communityService.approveJoinRequest(
        req.params.requestId,
        req.user!.id
      );

      return res.status(CommunityController.HTTP_STATUS.OK).json({
        message: 'Join request approved successfully',
        community: CommunityMapper.toSafeCommunity(community),
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  rejectJoinRequest = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await communityService.rejectJoinRequest(req.params.requestId, req.user!.id);

      return res.status(CommunityController.HTTP_STATUS.OK).json({
        message: 'Join request rejected successfully',
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  removeMember = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await communityService.removeMember(
        req.params.id,
        req.params.memberId,
        req.user!.id
      );

      return res.status(CommunityController.HTTP_STATUS.OK).json({
        message: 'Member removed successfully',
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  banUser = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await communityService.banUser(
        req.params.id,
        req.params.memberId,
        req.user!.id
      );

      return res.status(CommunityController.HTTP_STATUS.OK).json({
        message: 'User banned successfully',
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  unbanUser = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await communityService.unbanUser(
        req.params.id,
        req.params.memberId,
        req.user!.id
      );

      return res.status(CommunityController.HTTP_STATUS.OK).json({
        message: 'User unbanned successfully',
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  getBannedUsers = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const bannedUsers = await communityService.getBannedUsers(
        req.params.id,
        req.user!.id
      );

      // Map _id to id for frontend compatibility
      const formattedBannedUsers = bannedUsers.map((user: any) => ({
        id: user._id?.toString() || user.id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
        type: user.type,
      }));

      return res.status(CommunityController.HTTP_STATUS.OK).json({
        bannedUsers: formattedBannedUsers,
        total: formattedBannedUsers.length,
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  updateMemberRole = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await communityService.updateMemberRole(
        req.params.id,
        req.params.memberId,
        req.body.role,
        req.user!.id
      );

      return res.status(CommunityController.HTTP_STATUS.OK).json({
        message: 'Member role updated successfully',
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  requestOwnershipTransfer = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await communityService.requestOwnershipTransfer(
        req.params.id,
        req.body.newOwnerId,
        req.user!.id
      );

      return res.status(CommunityController.HTTP_STATUS.OK).json(result);
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  getPendingOwnershipTransfer = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await communityService.getPendingOwnershipTransfer(
        req.params.id,
        req.user!.id
      );

      return res.status(CommunityController.HTTP_STATUS.OK).json(result);
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  getMyOwnershipTransferRequests = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await communityService.getMyOwnershipTransferRequests(req.user!.id);

      return res.status(CommunityController.HTTP_STATUS.OK).json(result);
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  getMySentOwnershipTransferRequests = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await communityService.getMySentOwnershipTransferRequests(req.user!.id);

      return res.status(CommunityController.HTTP_STATUS.OK).json(result);
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  cancelOwnershipTransfer = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await communityService.cancelOwnershipTransfer(
        req.params.transferId,
        req.user!.id
      );

      return res.status(CommunityController.HTTP_STATUS.OK).json({
        message: 'Ownership transfer request cancelled successfully',
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  cancelOwnershipTransferByCommunity = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await communityService.cancelOwnershipTransferByCommunity(
        req.params.id,
        req.user!.id
      );

      return res.status(CommunityController.HTTP_STATUS.OK).json({
        message: 'Ownership transfer request cancelled successfully',
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  acceptOwnershipTransfer = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await communityService.acceptOwnershipTransfer(
        req.params.transferId,
        req.user!.id
      );

      return res.status(CommunityController.HTTP_STATUS.OK).json(result);
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  rejectOwnershipTransfer = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await communityService.rejectOwnershipTransfer(
        req.params.transferId,
        req.user!.id
      );

      return res.status(CommunityController.HTTP_STATUS.OK).json({
        message: 'Ownership transfer request rejected successfully',
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };
}

export const communityController = new CommunityController();

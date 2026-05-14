import { Router } from 'express';
import { communityController } from '../controllers';
import { authMiddleware, optionalAuthMiddleware } from '../../../shared/middleware/auth.middleware';
import { busboyUploadMiddleware } from '../../image/middleware';
import { IMAGE_VALIDATION } from '../../image/services';
import {
  validateCreateCommunity,
  validateUpdateCommunity,
  validateCommunityId,
} from '../validators';

const router = Router();

router.get('/', optionalAuthMiddleware, communityController.getCommunities);

router.get(
  '/:id',
  optionalAuthMiddleware,
  validateCommunityId,
  communityController.getCommunityById
);

router.get(
  '/:id/can-view-posts',
  optionalAuthMiddleware,
  validateCommunityId,
  communityController.canViewCommunityPosts
);

router.get(
  '/:id/members',
  validateCommunityId,
  communityController.getCommunityMembers
);

router.get(
  '/:id/banned-users',
  authMiddleware,
  validateCommunityId,
  communityController.getBannedUsers
);

router.post(
  '/',
  authMiddleware,
  busboyUploadMiddleware({
    maxFiles: 1,
    maxFileSize: IMAGE_VALIDATION.MAX_FILE_SIZE,
    allowedMimeTypes: [...IMAGE_VALIDATION.ALLOWED_MIME_TYPES],
    filesRequired: false,
  }),
  validateCreateCommunity,
  communityController.createCommunity
);

router.put(
  '/:id',
  authMiddleware,
  validateCommunityId,
  busboyUploadMiddleware({
    maxFiles: 1,
    maxFileSize: IMAGE_VALIDATION.MAX_FILE_SIZE,
    allowedMimeTypes: [...IMAGE_VALIDATION.ALLOWED_MIME_TYPES],
    filesRequired: false,
  }),
  validateUpdateCommunity,
  communityController.updateCommunity
);

router.delete(
  '/:id',
  authMiddleware,
  validateCommunityId,
  communityController.deleteCommunity
);

router.post(
  '/:id/join',
  authMiddleware,
  validateCommunityId,
  communityController.joinCommunity
);

router.delete(
  '/:id/leave',
  authMiddleware,
  validateCommunityId,
  communityController.leaveCommunity
);

router.post(
  '/:id/invitations',
  authMiddleware,
  validateCommunityId,
  communityController.sendInvitations
);

router.get(
  '/:id/invitations',
  authMiddleware,
  validateCommunityId,
  communityController.getInvitations
);

router.delete(
  '/:id/invitations/:invitationId',
  authMiddleware,
  validateCommunityId,
  communityController.cancelInvitation
);

router.post(
  '/invitations/:invitationId/accept',
  authMiddleware,
  communityController.acceptInvitation
);

router.get(
  '/invitations/me',
  authMiddleware,
  communityController.getMyInvitations
);

router.get(
  '/invitations/sent',
  authMiddleware,
  communityController.getMySentInvitations
);

router.post(
  '/:id/join-requests',
  authMiddleware,
  validateCommunityId,
  communityController.createJoinRequest
);

router.delete(
  '/:id/join-requests/cancel',
  authMiddleware,
  validateCommunityId,
  communityController.cancelJoinRequest
);

router.get(
  '/:id/join-requests',
  authMiddleware,
  validateCommunityId,
  communityController.getJoinRequests
);

router.post(
  '/:id/join-requests/:requestId/approve',
  authMiddleware,
  validateCommunityId,
  communityController.approveJoinRequest
);

router.post(
  '/:id/join-requests/:requestId/reject',
  authMiddleware,
  validateCommunityId,
  communityController.rejectJoinRequest
);

router.delete(
  '/:id/members/:memberId',
  authMiddleware,
  validateCommunityId,
  communityController.removeMember
);

router.post(
  '/:id/members/:memberId/ban',
  authMiddleware,
  validateCommunityId,
  communityController.banUser
);

router.delete(
  '/:id/members/:memberId/ban',
  authMiddleware,
  validateCommunityId,
  communityController.unbanUser
);

router.patch(
  '/:id/members/:memberId/role',
  authMiddleware,
  validateCommunityId,
  communityController.updateMemberRole
);

// Ownership transfer endpoints
router.post(
  '/:id/ownership-transfer',
  authMiddleware,
  validateCommunityId,
  communityController.requestOwnershipTransfer
);

router.get(
  '/:id/ownership-transfer',
  authMiddleware,
  validateCommunityId,
  communityController.getPendingOwnershipTransfer
);

router.get(
  '/ownership-transfers/me',
  authMiddleware,
  communityController.getMyOwnershipTransferRequests
);

router.delete(
  '/ownership-transfers/:transferId',
  authMiddleware,
  communityController.cancelOwnershipTransfer
);

router.post(
  '/ownership-transfers/:transferId/accept',
  authMiddleware,
  communityController.acceptOwnershipTransfer
);

router.post(
  '/ownership-transfers/:transferId/reject',
  authMiddleware,
  communityController.rejectOwnershipTransfer
);

export default router;

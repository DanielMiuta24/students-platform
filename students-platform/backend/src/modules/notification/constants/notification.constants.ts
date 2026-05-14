export const NOTIFICATION_ERRORS = {
  NOT_FOUND: 'Notification not found',
  UNAUTHORIZED: 'Unauthorized to access this notification',
  INVALID_RECIPIENT: 'Invalid recipient user',
  INVALID_ACTOR: 'Invalid actor user',
  INVALID_TARGET: 'Invalid target reference',
  CREATION_FAILED: 'Failed to create notification',
  UPDATE_FAILED: 'Failed to update notification',
  DELETE_FAILED: 'Failed to delete notification',
} as const;

export const NOTIFICATION_PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const NOTIFICATION_EMAIL_SUBJECTS = {
  comment: 'New comment on your post',
  reply: 'Someone replied to your comment',
  like: 'Someone liked your content',
  follow: 'You have a new follower',
  view: 'Someone viewed your profile',
  message: 'You have a new message',
  new_post: 'New post from someone you follow',
  community_join: 'Someone joined your community',
  community_post: 'New post in your community',
  community_invite: 'You have been invited to a community',
  community_join_request: 'New request to join your community',
  community_join_approved: 'Your request to join a community was approved',
  admin_assign: 'You have been assigned as an admin',
  ownership_transfer_request: 'Request to transfer community ownership',
  ownership_transfer: 'Community ownership transferred',
  ownership_transfer_rejected: 'Community ownership transfer rejected',
} as const;

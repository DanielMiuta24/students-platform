export const USER_TYPES = ['Student', 'StudySeeker', 'Admin'] as const;
export type UserType = typeof USER_TYPES[number];

export const PROVIDERS = ['local', 'google'] as const;
export type Provider = typeof PROVIDERS[number];



export const NOTIFICATION_TYPES = [
'comment',
'reply',
'like',
'follow',
'view',
'message',
'new_post',
'community_join',
'community_post',
'community_invite',
] as const;

export type NotificationType = typeof NOTIFICATION_TYPES[number];
export const TARGET_MODELS = ['Post', 'Comment', 'User', 'Message', 'Community'] as const;
export type TargetModel = typeof TARGET_MODELS[number];

/**
 * Post status enum
 */
export const POST_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;

export type PostStatus = typeof POST_STATUS[keyof typeof POST_STATUS];

/**
 * Post visibility enum
 */
export const POST_VISIBILITY = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  FRIENDS: 'friends',
  COMMUNITY: 'community',
} as const;

export type PostVisibility = typeof POST_VISIBILITY[keyof typeof POST_VISIBILITY];

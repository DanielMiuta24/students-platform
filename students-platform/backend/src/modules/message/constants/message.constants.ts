export const MESSAGE_ERROR = {
  NOT_FOUND: 'Message not found',
  UNAUTHORIZED: 'You are not authorized to access this message',
  INVALID_RECIPIENT: 'Invalid recipient user ID',
  CONTENT_REQUIRED: 'Message content is required',
  CONTENT_TOO_LONG: 'Message content exceeds maximum length',
  INVALID_ATTACHMENT: 'Invalid attachment format',
  CANNOT_MESSAGE_SELF: 'Cannot send message to yourself',
  RECIPIENT_NOT_FOUND: 'Recipient user not found',
  CONVERSATION_NOT_FOUND: 'Conversation not found',
  DELETE_FOR_EVERYONE_EXPIRED: 'Cannot delete for everyone after 68 hours',
  INVALID_DELETE_TYPE: 'Invalid delete type. Must be "me" or "everyone"',
  EDIT_TIME_EXPIRED: 'Cannot edit message after 15 minutes',
} as const;

export const MESSAGE_VALIDATION = {
  CONTENT_MAX_LENGTH: 5000,
  CONTENT_MIN_LENGTH: 1,
  MAX_ATTACHMENTS: 5,
  DELETE_FOR_EVERYONE_HOURS: 68,
  EDIT_TIME_MINUTES: 15,
} as const;

export const MESSAGE_EVENTS = {
  NEW: 'message:new',
  UPDATED: 'message:updated',
  DELETED: 'message:deleted',
  READ: 'message:read',
  TYPING: 'message:typing',
} as const;

export const MESSAGE_SUCCESS = {
  CREATED: 'Message sent successfully',
  UPDATED: 'Message updated successfully',
  DELETED: 'Message deleted successfully',
  MARKED_AS_READ: 'Message marked as read',
  CONVERSATION_DELETED: 'Conversation deleted successfully',
} as const;

import type { AttachmentMeta } from '@/shared/types/files';
import type { SafeUser } from '@/shared/types/domain';

export interface CreateMessageDTO {
  recipientId: string;
  content: string;
  attachments?: AttachmentMeta[];
}

export interface UpdateMessageDTO {
  content: string;
}

export interface DeleteMessageDTO {
  deleteFor: 'me' | 'everyone';
}

export interface SafeMessage {
  id: string;
  sender: SafeUser;
  recipient: SafeUser;
  content: string;
  attachments: AttachmentMeta[];
  isRead: boolean;
  readAt?: Date | null;
  isEdited?: boolean;
  editedAt?: Date | null;
  isDeletedForEveryone?: boolean;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationDTO {
  userId: string;
  user: SafeUser;
  latestMessage: SafeMessage | null;
  unreadCount: number;
  lastActivity: Date;
}

export interface MessageListResult {
  messages: SafeMessage[];
  total: number;
  page: number;
  pages: number;
}

export interface ConversationListResult {
  conversations: ConversationDTO[];
  total: number;
}

export interface MessageEventPayload {
  id: string;
  timestamp: Date;
  data: SafeMessage;
}

export interface TypingIndicatorPayload {
  id: string;
  timestamp: Date;
  data: {
    userId: string;
    name: string;
    isTyping: boolean;
  };
}

export interface ReadReceiptPayload {
  id: string;
  timestamp: Date;
  data: {
    messageId: string;
    userId: string;
  };
}

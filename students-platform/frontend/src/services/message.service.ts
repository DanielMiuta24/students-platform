import { api } from './api';

export interface CreateMessageDTO {
  recipientId: string;
  content: string;
  attachments?: any[];
}

export interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    username: string;
    email: string;
    profilePicture: string | null;
  };
  recipient: {
    id: string;
    name: string;
    username: string;
    email: string;
    profilePicture: string | null;
  };
  content: string;
  attachments: any[];
  isRead: boolean;
  readAt: string | null;
  isEdited?: boolean;
  editedAt?: string | null;
  isDeletedForEveryone?: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  userId: string;
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
    profilePicture: string | null;
  };
  latestMessage: Message | null;
  unreadCount: number;
  lastActivity: string;
}

export interface UserSearchResult {
  id: string;
  name: string;
  username: string;
  email: string;
  profilePicture: string | null;
  priority: number;
  hasConversation: boolean;
}

export const messageService = {
  async sendMessage(dto: CreateMessageDTO): Promise<Message> {
    const response = await api.post('messages', dto);
    return response.data.data;
  },

  async getConversations(): Promise<Conversation[]> {
    const response = await api.get('messages/conversations');
    return response.data.data.conversations;
  },

  async getConversation(userId: string, page: number = 1, limit: number = 50): Promise<{ messages: Message[]; total: number; page: number; pages: number }> {
    const response = await api.get(`messages/conversations/${userId}`, {
      params: { page, limit },
    });
    return response.data.data;
  },

  async markConversationAsRead(userId: string): Promise<void> {
    await api.post(`messages/conversations/${userId}/read`);
  },

  async getUnreadCount(): Promise<number> {
    const response = await api.get('messages/unread-count');
    return response.data.data.count;
  },

  async updateMessage(messageId: string, content: string): Promise<Message> {
    const response = await api.put(`messages/${messageId}`, { content });
    return response.data.data;
  },

  async deleteMessage(messageId: string, deleteFor: 'me' | 'everyone' = 'me'): Promise<void> {
    await api.delete(`messages/${messageId}`, {
      data: { deleteFor },
    });
  },

  async deleteConversation(userId: string): Promise<void> {
    await api.delete(`messages/conversations/${userId}`);
  },

  async markAsRead(messageId: string): Promise<void> {
    await api.post(`messages/${messageId}/read`);
  },

  async searchConversations(query: string): Promise<Conversation[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }
    const response = await api.get('messages/search/conversations', {
      params: { q: query },
    });
    return response.data.data;
  },

  async searchUsers(query: string): Promise<UserSearchResult[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }
    const response = await api.get('messages/search/users', {
      params: { q: query },
    });
    return response.data.data;
  },

  async getConversationMessages(userId: string): Promise<Message[]> {
    const response = await this.getConversation(userId, 1, 50);
    return response.messages;
  },

  async notifyTyping(recipientId: string, isTyping: boolean): Promise<void> {
    await api.post('messages/typing', { recipientId, isTyping });
  },

  canDeleteForEveryone(message: Message): boolean {
    const messageAge = Date.now() - new Date(message.createdAt).getTime();
    const maxAge = 68 * 60 * 60 * 1000; // 68 hours in milliseconds
    return messageAge <= maxAge;
  },

  canEdit(message: Message): boolean {
    const messageAge = Date.now() - new Date(message.createdAt).getTime();
    const maxAge = 15 * 60 * 1000; // 15 minutes in milliseconds
    return messageAge <= maxAge;
  },
};

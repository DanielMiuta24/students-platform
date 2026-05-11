import type { ConversationDTO, SafeMessage, SafeUser } from '../types';

export class ConversationDTOBuilder {
  private userId?: string;
  private user?: SafeUser;
  private latestMessage?: SafeMessage | null;
  private unreadCount?: number;
  private lastActivity?: Date;

  setUserId(userId: string): this {
    this.userId = userId;
    return this;
  }

  setUser(user: SafeUser): this {
    this.user = user;
    return this;
  }

  setLatestMessage(message: SafeMessage | null): this {
    this.latestMessage = message;
    return this;
  }

  setUnreadCount(count: number): this {
    this.unreadCount = count;
    return this;
  }

  setLastActivity(date: Date): this {
    this.lastActivity = date;
    return this;
  }

  build(): ConversationDTO {
    if (!this.userId || !this.user) {
      throw new Error('UserId and user are required for ConversationDTO');
    }

    return {
      userId: this.userId,
      user: this.user,
      latestMessage: this.latestMessage ?? null,
      unreadCount: this.unreadCount ?? 0,
      lastActivity: this.lastActivity ?? new Date(),
    };
  }

  static create(): ConversationDTOBuilder {
    return new ConversationDTOBuilder();
  }
}

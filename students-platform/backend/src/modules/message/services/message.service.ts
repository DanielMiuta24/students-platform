import { Types } from 'mongoose';
import { MessageModel, type MessageDoc } from '../models/message.model';
import { MessageValidator } from '../validators';
import { MESSAGE_ERROR, MESSAGE_EVENTS, MESSAGE_VALIDATION } from '../constants';
import { ConversationDTOBuilder } from '../builders';
import type {
  CreateMessageDTO,
  UpdateMessageDTO,
  SafeMessage,
  MessageListResult,
  ConversationListResult,
  MessageEventPayload,
  ReadReceiptPayload,
  ConversationDTO,
} from '../types';
import type { SafeUser } from '../../../shared/types/domain';
import { realtimeService } from '../../realtime/services';
import { User } from '../../user/models';
import { followService } from '../../follow/services';

class MessageService {
  async createMessage(dto: CreateMessageDTO, senderId: string): Promise<SafeMessage> {
    MessageValidator.validateCreateDTO(dto, senderId);

    const recipient = await User.findById(dto.recipientId);
    if (!recipient) {
      throw new Error(MESSAGE_ERROR.RECIPIENT_NOT_FOUND);
    }

    const message = await MessageModel.create({
      sender: new Types.ObjectId(senderId),
      recipient: new Types.ObjectId(dto.recipientId),
      content: dto.content,
      attachments: dto.attachments || [],
      isRead: false,
    });

    const populated = await this.populateMessage(message);
    const safeMessage = this.toSafeMessage(populated);

    const payload: MessageEventPayload = {
      id: message._id.toString(),
      timestamp: new Date(),
      data: safeMessage,
    };

    await realtimeService.publishToMultipleRooms(
      [
        { type: 'user', id: senderId },
        { type: 'user', id: dto.recipientId },
      ],
      MESSAGE_EVENTS.NEW,
      payload
    );

    return safeMessage;
  }

  async getMessage(messageId: string, userId: string): Promise<SafeMessage> {
    if (!MessageValidator.validateObjectId(messageId)) {
      throw new Error(MESSAGE_ERROR.NOT_FOUND);
    }

    const message = await MessageModel.findById(messageId)
      .populate('sender', 'name username email profilePicture')
      .populate('recipient', 'name username email profilePicture');

    if (!message) {
      throw new Error(MESSAGE_ERROR.NOT_FOUND);
    }

    this.verifyAccess(message, userId);

    return this.toSafeMessage(message);
  }

  async getConversation(
    userId: string,
    otherUserId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<MessageListResult> {
    MessageValidator.validateRecipientId(otherUserId);
    const { page: validPage, limit: validLimit } = MessageValidator.validatePagination(page, limit);

    const userIdObj = new Types.ObjectId(userId);
    const otherUserIdObj = new Types.ObjectId(otherUserId);

    const query = {
      $or: [
        {
          sender: userIdObj,
          recipient: otherUserIdObj,
          deletedForSender: { $ne: true }
        },
        {
          sender: otherUserIdObj,
          recipient: userIdObj,
          deletedForRecipient: { $ne: true }
        },
      ],
    };

    const total = await MessageModel.countDocuments(query);
    const pages = Math.ceil(total / validLimit);

    const messages = await MessageModel.find(query)
      .sort({ createdAt: -1 })
      .skip((validPage - 1) * validLimit)
      .limit(validLimit)
      .populate('sender', 'name username email profilePicture')
      .populate('recipient', 'name username email profilePicture');

    return {
      messages: messages.map((msg) => this.toSafeMessage(msg)).reverse(),
      total,
      page: validPage,
      pages,
    };
  }

  async getConversations(userId: string): Promise<ConversationListResult> {
    const sentMessages = await MessageModel.aggregate([
      { $match: { sender: new Types.ObjectId(userId) } },
      { $group: { _id: '$recipient', lastMessage: { $max: '$createdAt' } } },
    ]);

    const receivedMessages = await MessageModel.aggregate([
      { $match: { recipient: new Types.ObjectId(userId) } },
      { $group: { _id: '$sender', lastMessage: { $max: '$createdAt' } } },
    ]);

    const conversationUserIds = new Set<string>();
    const conversationDates = new Map<string, Date>();

    for (const msg of sentMessages) {
      const id = msg._id.toString();
      conversationUserIds.add(id);
      conversationDates.set(id, msg.lastMessage);
    }

    for (const msg of receivedMessages) {
      const id = msg._id.toString();
      conversationUserIds.add(id);
      const existing = conversationDates.get(id);
      if (!existing || msg.lastMessage > existing) {
        conversationDates.set(id, msg.lastMessage);
      }
    }

    if (conversationUserIds.size === 0) {
      return {
        conversations: [],
        total: 0,
      };
    }

    const users = await User.find({ _id: { $in: Array.from(conversationUserIds) } }).select(
      'name username email profilePicture'
    );

    const conversations = await Promise.all(
      users.map(async (user) => {
        const otherUserId = user._id.toString();

        const latestMessageDoc = await MessageModel.findOne({
          $or: [
            { sender: new Types.ObjectId(userId), recipient: user._id },
            { sender: user._id, recipient: new Types.ObjectId(userId) },
          ],
        })
          .sort({ createdAt: -1 })
          .populate('sender', 'name username email profilePicture')
          .populate('recipient', 'name username email profilePicture');

        const unreadCount = await MessageModel.countDocuments({
          sender: user._id,
          recipient: new Types.ObjectId(userId),
          isRead: false,
        });

        return ConversationDTOBuilder.create()
          .setUserId(otherUserId)
          .setUser(this.toSafeUser(user))
          .setLatestMessage(latestMessageDoc ? this.toSafeMessage(latestMessageDoc) : null)
          .setUnreadCount(unreadCount)
          .setLastActivity(conversationDates.get(otherUserId) || new Date())
          .build();
      })
    );

    conversations.sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());

    return {
      conversations,
      total: conversations.length,
    };
  }

  async updateMessage(messageId: string, dto: UpdateMessageDTO, userId: string): Promise<SafeMessage> {
    MessageValidator.validateUpdateDTO(dto);

    if (!MessageValidator.validateObjectId(messageId)) {
      throw new Error(MESSAGE_ERROR.NOT_FOUND);
    }

    const message = await MessageModel.findById(messageId);
    if (!message) {
      throw new Error(MESSAGE_ERROR.NOT_FOUND);
    }

    this.verifyOwnership(message, userId);

    // Check if message is within 15 minutes edit window
    const messageAge = Date.now() - message.createdAt!.getTime();
    const maxEditAge = MESSAGE_VALIDATION.EDIT_TIME_MINUTES * 60 * 1000;

    if (messageAge > maxEditAge) {
      throw new Error(MESSAGE_ERROR.EDIT_TIME_EXPIRED);
    }

    message.content = dto.content;
    message.isEdited = true;
    message.editedAt = new Date();
    await message.save();

    // Store IDs before population
    const senderId = message.sender.toString();
    const recipientId = message.recipient.toString();

    const populated = await this.populateMessage(message);
    const safeMessage = this.toSafeMessage(populated);

    const payload: MessageEventPayload = {
      id: message._id.toString(),
      timestamp: new Date(),
      data: safeMessage,
    };

    console.log('[MessageService] Emitting message:updated event to rooms:', [
      { type: 'user', id: senderId },
      { type: 'user', id: recipientId },
    ]);
    console.log('[MessageService] Event payload:', payload);

    await realtimeService.publishToMultipleRooms(
      [
        { type: 'user', id: senderId },
        { type: 'user', id: recipientId },
      ],
      MESSAGE_EVENTS.UPDATED,
      payload
    );

    return safeMessage;
  }

  async deleteMessage(messageId: string, userId: string, deleteFor: 'me' | 'everyone' = 'me'): Promise<void> {
    if (!MessageValidator.validateObjectId(messageId)) {
      throw new Error(MESSAGE_ERROR.NOT_FOUND);
    }

    if (deleteFor !== 'me' && deleteFor !== 'everyone') {
      throw new Error(MESSAGE_ERROR.INVALID_DELETE_TYPE);
    }

    const message = await MessageModel.findById(messageId);
    if (!message) {
      throw new Error(MESSAGE_ERROR.NOT_FOUND);
    }

    this.verifyOwnership(message, userId);

    const senderId = message.sender.toString();
    const recipientId = message.recipient.toString();

    if (deleteFor === 'everyone') {
      // Check if message is within 68 hours
      const messageAge = Date.now() - message.createdAt!.getTime();
      const maxAge = MESSAGE_VALIDATION.DELETE_FOR_EVERYONE_HOURS * 60 * 60 * 1000;

      if (messageAge > maxAge) {
        throw new Error(MESSAGE_ERROR.DELETE_FOR_EVERYONE_EXPIRED);
      }

      // Delete for everyone
      message.isDeletedForEveryone = true;
      message.deletedAt = new Date();
      message.content = 'This message was deleted';
      await message.save();

      const populated = await this.populateMessage(message);
      const safeMessage = this.toSafeMessage(populated);

      const payload: MessageEventPayload = {
        id: messageId,
        timestamp: new Date(),
        data: safeMessage,
      };

      await realtimeService.publishToMultipleRooms(
        [
          { type: 'user', id: senderId },
          { type: 'user', id: recipientId },
        ],
        MESSAGE_EVENTS.UPDATED,
        payload
      );
    } else {
      // Delete for me only
      if (userId === senderId) {
        message.deletedForSender = true;
      } else {
        message.deletedForRecipient = true;
      }

      // If both users deleted it, remove it completely
      if (message.deletedForSender && message.deletedForRecipient) {
        await MessageModel.findByIdAndDelete(messageId);
      } else {
        await message.save();
      }

      const payload = {
        id: messageId,
        timestamp: new Date(),
        data: { messageId, userId, deleteFor: 'me' },
      };

      // Only notify the user who deleted it
      await realtimeService.publishToRoom('user', userId, MESSAGE_EVENTS.DELETED, payload);
    }
  }

  async markAsRead(messageId: string, userId: string): Promise<void> {
    if (!MessageValidator.validateObjectId(messageId)) {
      throw new Error(MESSAGE_ERROR.NOT_FOUND);
    }

    const message = await MessageModel.findById(messageId);
    if (!message) {
      throw new Error(MESSAGE_ERROR.NOT_FOUND);
    }

    if (message.recipient.toString() !== userId) {
      throw new Error(MESSAGE_ERROR.UNAUTHORIZED);
    }

    if (message.isRead) {
      return;
    }

    message.isRead = true;
    message.readAt = new Date();
    await message.save();

    const payload: ReadReceiptPayload = {
      id: messageId,
      timestamp: new Date(),
      data: {
        messageId,
        userId,
      },
    };

    await realtimeService.publishToRoom('user', message.sender.toString(), MESSAGE_EVENTS.READ, payload);
  }

  async markConversationAsRead(userId: string, otherUserId: string): Promise<number> {
    MessageValidator.validateRecipientId(otherUserId);

    const result = await MessageModel.updateMany(
      {
        sender: new Types.ObjectId(otherUserId),
        recipient: new Types.ObjectId(userId),
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    if (result.modifiedCount > 0) {
      const payload = {
        id: `conversation-${userId}-${otherUserId}`,
        timestamp: new Date(),
        data: {
          userId,
          otherUserId,
          count: result.modifiedCount,
        },
      };

      await realtimeService.publishToRoom('user', otherUserId, MESSAGE_EVENTS.READ, payload);
    }

    return result.modifiedCount;
  }

  async getUnreadCount(userId: string): Promise<number> {
    return await MessageModel.countDocuments({
      recipient: new Types.ObjectId(userId),
      isRead: false,
    });
  }

  async searchConversations(userId: string, query: string): Promise<ConversationDTO[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const conversations = await this.getConversations(userId);
    const searchQuery = query.toLowerCase().trim();

    const filtered = conversations.conversations.filter((conv) => {
      const nameMatch = conv.user.name.toLowerCase().includes(searchQuery);
      const usernameMatch = conv.user.username.toLowerCase().includes(searchQuery);
      const messageMatch = conv.latestMessage?.content.toLowerCase().includes(searchQuery);

      return nameMatch || usernameMatch || messageMatch;
    });

    return filtered;
  }

  async searchUsers(userId: string, query: string): Promise<Array<SafeUser & { priority: number; hasConversation: boolean }>> {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const searchQuery = query.toLowerCase().trim();

    const [friendIds, followingIds, conversations] = await Promise.all([
      followService.getFriendIds(userId),
      followService.getFollowingIds(userId),
      this.getConversations(userId),
    ]);

    const conversationUserIds = new Set(
      conversations?.conversations?.map(c => c.userId) || []
    );
    const friendIdsSet = new Set(friendIds || []);
    const followingIdsSet = new Set(followingIds || []);

    const users = await User.find({
      _id: { $ne: new Types.ObjectId(userId) },
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { username: { $regex: searchQuery, $options: 'i' } },
      ],
    })
      .select('name username email profilePicture')
      .limit(50)
      .lean();

    const results = users.map((user) => {
      const userIdStr = user._id.toString();
      const hasConversation = conversationUserIds.has(userIdStr);
      const isFriend = friendIdsSet.has(userIdStr);
      const isFollowing = followingIdsSet.has(userIdStr);

      const exactUsernameMatch = user.username.toLowerCase() === searchQuery;
      const exactNameMatch = user.name.toLowerCase() === searchQuery;

      let priority = 0;
      if (hasConversation) priority += 1000;
      if (isFriend) priority += 500;
      if (isFollowing) priority += 250;
      if (exactUsernameMatch) priority += 100;
      if (exactNameMatch) priority += 50;

      return {
        ...this.toSafeUser(user),
        priority,
        hasConversation,
      };
    });

    results.sort((a, b) => b.priority - a.priority);

    return results;
  }

  private async populateMessage(message: MessageDoc): Promise<MessageDoc> {
    return await message.populate([
      { path: 'sender', select: 'name username email profilePicture' },
      { path: 'recipient', select: 'name username email profilePicture' },
    ]);
  }

  private verifyAccess(message: MessageDoc, userId: string): void {
    const senderId = message.sender._id?.toString() || message.sender.toString();
    const recipientId = message.recipient._id?.toString() || message.recipient.toString();

    if (senderId !== userId && recipientId !== userId) {
      throw new Error(MESSAGE_ERROR.UNAUTHORIZED);
    }
  }

  private verifyOwnership(message: MessageDoc, userId: string): void {
    const senderId = message.sender._id?.toString() || message.sender.toString();

    if (senderId !== userId) {
      throw new Error(MESSAGE_ERROR.UNAUTHORIZED);
    }
  }

  async deleteConversation(userId: string, otherUserId: string): Promise<void> {
    MessageValidator.validateRecipientId(otherUserId);

    const userIdObj = new Types.ObjectId(userId);
    const otherUserIdObj = new Types.ObjectId(otherUserId);

    // Mark all messages as deleted for this user
    const updateResult = await MessageModel.updateMany(
      {
        $or: [
          { sender: userIdObj, recipient: otherUserIdObj },
          { sender: otherUserIdObj, recipient: userIdObj },
        ],
      },
      {
        $set: {
          [`deletedForSender`]: true,
        },
      }
    );

    // Find messages where both users have deleted and remove them
    const bothDeletedMessages = await MessageModel.find({
      $or: [
        { sender: userIdObj, recipient: otherUserIdObj },
        { sender: otherUserIdObj, recipient: userIdObj },
      ],
      deletedForSender: true,
      deletedForRecipient: true,
    });

    if (bothDeletedMessages.length > 0) {
      await MessageModel.deleteMany({
        _id: { $in: bothDeletedMessages.map(m => m._id) },
      });
    }
  }

  broadcastTypingIndicator(userId: string, recipientId: string, name: string, isTyping: boolean): void {
    const payload = {
      id: `typing-${userId}-${recipientId}`,
      timestamp: new Date(),
      data: {
        userId,
        recipientId,
        name,
        isTyping,
      },
    };

    realtimeService.publishToRoom('user', recipientId, MESSAGE_EVENTS.TYPING, payload);
  }

  private toSafeMessage(message: MessageDoc): SafeMessage {
    return {
      id: message._id.toString(),
      sender: this.toSafeUser(message.sender as any),
      recipient: this.toSafeUser(message.recipient as any),
      content: message.content,
      attachments: message.attachments || [],
      isRead: message.isRead || false,
      readAt: message.readAt || null,
      isEdited: message.isEdited || false,
      editedAt: message.editedAt || null,
      isDeletedForEveryone: message.isDeletedForEveryone || false,
      deletedAt: message.deletedAt || null,
      createdAt: message.createdAt!,
      updatedAt: message.updatedAt!,
    };
  }

  private toSafeUser(user: any): SafeUser {
    return {
      id: user._id.toString(),
      name: user.name,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture || null,
    };
  }
}

export const messageService = new MessageService();

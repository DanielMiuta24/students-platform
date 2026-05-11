import { Types } from 'mongoose';
import { messageService } from '../../../modules/message/services/message.service';
import { MessageModel } from '../../../modules/message/models/message.model';
import { User } from '../../../modules/user/models';

jest.mock('../../../modules/message/models/message.model');
jest.mock('../../../modules/user/models');
jest.mock('../../../modules/realtime/services');

describe('MessageService', () => {
  describe('toSafeUser', () => {
    it('should map avatar field to profilePicture', async () => {
      const mockUser = {
        _id: new Types.ObjectId(),
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        avatar: 'https://example.com/avatar.jpg',
      };

      const mockMessage = {
        _id: new Types.ObjectId(),
        sender: mockUser,
        recipient: mockUser,
        content: 'Test message',
        attachments: [],
        isRead: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = (messageService as any).toSafeMessage(mockMessage);

      expect(result.sender.profilePicture).toBe('https://example.com/avatar.jpg');
      expect(result.recipient.profilePicture).toBe('https://example.com/avatar.jpg');
    });

    it('should handle null avatar', async () => {
      const mockUser = {
        _id: new Types.ObjectId(),
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        avatar: null,
      };

      const mockMessage = {
        _id: new Types.ObjectId(),
        sender: mockUser,
        recipient: mockUser,
        content: 'Test message',
        attachments: [],
        isRead: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = (messageService as any).toSafeMessage(mockMessage);

      expect(result.sender.profilePicture).toBeNull();
      expect(result.recipient.profilePicture).toBeNull();
    });

    it('should handle empty string avatar', async () => {
      const mockUser = {
        _id: new Types.ObjectId(),
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        avatar: '',
      };

      const mockMessage = {
        _id: new Types.ObjectId(),
        sender: mockUser,
        recipient: mockUser,
        content: 'Test message',
        attachments: [],
        isRead: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = (messageService as any).toSafeMessage(mockMessage);

      expect(result.sender.profilePicture).toBeNull();
      expect(result.recipient.profilePicture).toBeNull();
    });
  });

  describe('deleteConversation', () => {
    it('should mark messages as deleted for sender and recipient separately', async () => {
      const userId = new Types.ObjectId().toString();
      const otherUserId = new Types.ObjectId().toString();

      const updateManySpy = jest.spyOn(MessageModel, 'updateMany').mockResolvedValue({ modifiedCount: 5 } as any);
      const findSpy = jest.spyOn(MessageModel, 'find').mockResolvedValue([]);
      const deleteManySpy = jest.spyOn(MessageModel, 'deleteMany').mockResolvedValue({ deletedCount: 0 } as any);

      await messageService.deleteConversation(userId, otherUserId);

      expect(updateManySpy).toHaveBeenCalledTimes(2);
      expect(updateManySpy).toHaveBeenCalledWith(
        expect.objectContaining({
          sender: expect.any(Types.ObjectId),
          recipient: expect.any(Types.ObjectId),
        }),
        expect.objectContaining({
          $set: { deletedForSender: true },
        })
      );
      expect(updateManySpy).toHaveBeenCalledWith(
        expect.objectContaining({
          sender: expect.any(Types.ObjectId),
          recipient: expect.any(Types.ObjectId),
        }),
        expect.objectContaining({
          $set: { deletedForRecipient: true },
        })
      );

      updateManySpy.mockRestore();
      findSpy.mockRestore();
      deleteManySpy.mockRestore();
    });
  });
});

import { NotificationMapper } from '../../../modules/notification/mappers/notification.mapper';
import type { NotificationDoc } from '../../../modules/notification/models/notification.model';

describe('NotificationMapper', () => {
  describe('toDTO', () => {
    it('should map notification with Post target', () => {
      const recipientData = {
        _id: 'recipient123',
        name: 'Recipient User',
        profilePicture: 'recipient.jpg',
      };
      const actorData = {
        _id: 'actor123',
        name: 'Actor User',
        profilePicture: 'actor.jpg',
      };
      const targetData = {
        _id: 'post123',
        title: 'Test Post',
        content: 'Test Content',
      };

      const mockNotification = {
        _id: 'notif123',
        recipient: 'recipient123',
        actor: 'actor123',
        type: 'comment' as const,
        targetModel: 'Post' as const,
        target: 'post123',
        read: false,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        populated: jest.fn((field: string) => {
          if (field === 'recipient') return recipientData;
          if (field === 'actor') return actorData;
          if (field === 'target') return targetData;
          return null;
        }),
      } as any as NotificationDoc;

      const result = NotificationMapper.toDTO(mockNotification);

      expect(result._id).toBe('notif123');
      expect(result.recipient).toEqual({
        _id: 'recipient123',
        name: 'Recipient User',
        profilePicture: 'recipient.jpg',
      });
      expect(result.actor).toEqual({
        _id: 'actor123',
        name: 'Actor User',
        profilePicture: 'actor.jpg',
      });
      expect(result.target).toHaveProperty('_id', 'post123');
      expect(result.target).toHaveProperty('title', 'Test Post');
      expect(result.target).toHaveProperty('content', 'Test Content');
      expect(result.read).toBe(false);
    });

    it('should map notification with Comment target', () => {
      const recipientData = {
        _id: 'recipient123',
        name: 'Recipient User',
      };
      const actorData = {
        _id: 'actor123',
        name: 'Actor User',
      };
      const targetData = {
        _id: 'comment123',
        content: 'Test Comment',
      };

      const mockNotification = {
        _id: 'notif123',
        recipient: 'recipient123',
        actor: 'actor123',
        type: 'reply' as const,
        targetModel: 'Comment' as const,
        target: 'comment123',
        read: false,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        populated: jest.fn((field: string) => {
          if (field === 'recipient') return recipientData;
          if (field === 'actor') return actorData;
          if (field === 'target') return targetData;
          return null;
        }),
      } as any as NotificationDoc;

      const result = NotificationMapper.toDTO(mockNotification);

      expect(result.target).toHaveProperty('_id', 'comment123');
      expect(result.target).toHaveProperty('content', 'Test Comment');
    });

    it('should map notification with Community target', () => {
      const recipientData = {
        _id: 'recipient123',
        name: 'Recipient User',
      };
      const actorData = {
        _id: 'actor123',
        name: 'Actor User',
      };
      const targetData = {
        _id: 'community123',
        name: 'Test Community',
        slug: 'test-community',
      };

      const mockNotification = {
        _id: 'notif123',
        recipient: 'recipient123',
        actor: 'actor123',
        type: 'community_join' as const,
        targetModel: 'Community' as const,
        target: 'community123',
        read: false,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        populated: jest.fn((field: string) => {
          if (field === 'recipient') return recipientData;
          if (field === 'actor') return actorData;
          if (field === 'target') return targetData;
          return null;
        }),
      } as any as NotificationDoc;

      const result = NotificationMapper.toDTO(mockNotification);

      expect(result.target).toHaveProperty('_id', 'community123');
      expect(result.target).toHaveProperty('name', 'Test Community');
      expect(result.target).toHaveProperty('slug', 'test-community');
    });

    it('should map notification with User target', () => {
      const recipientData = {
        _id: 'recipient123',
        name: 'Recipient User',
      };
      const actorData = {
        _id: 'actor123',
        name: 'Actor User',
      };
      const targetData = {
        _id: 'user123',
        name: 'Target User',
        profilePicture: 'target.jpg',
      };

      const mockNotification = {
        _id: 'notif123',
        recipient: 'recipient123',
        actor: 'actor123',
        type: 'follow' as const,
        targetModel: 'User' as const,
        target: 'user123',
        read: false,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        populated: jest.fn((field: string) => {
          if (field === 'recipient') return recipientData;
          if (field === 'actor') return actorData;
          if (field === 'target') return targetData;
          return null;
        }),
      } as any as NotificationDoc;

      const result = NotificationMapper.toDTO(mockNotification);

      expect(result.target).toHaveProperty('_id', 'user123');
      expect(result.target).toHaveProperty('name', 'Target User');
      expect(result.target).toHaveProperty('profilePicture', 'target.jpg');
    });

    it('should handle missing optional fields', () => {
      const recipientData = {
        _id: 'recipient123',
        name: 'Recipient User',
      };
      const actorData = {
        _id: 'actor123',
        name: 'Actor User',
      };
      const targetData = {
        _id: 'post123',
        title: 'Test Post',
      };

      const mockNotification = {
        _id: 'notif123',
        recipient: 'recipient123',
        actor: 'actor123',
        type: 'like' as const,
        targetModel: 'Post' as const,
        target: 'post123',
        read: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        populated: jest.fn((field: string) => {
          if (field === 'recipient') return recipientData;
          if (field === 'actor') return actorData;
          if (field === 'target') return targetData;
          return null;
        }),
      } as any as NotificationDoc;

      const result = NotificationMapper.toDTO(mockNotification);

      expect(result._id).toBe('notif123');
      expect(result.read).toBe(true);
      expect(result.recipient.profilePicture).toBeUndefined();
      expect(result.actor.profilePicture).toBeUndefined();
    });
  });
});

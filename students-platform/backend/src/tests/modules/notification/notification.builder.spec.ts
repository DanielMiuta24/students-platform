import { NotificationBuilder } from '../../../modules/notification/builders/notification.builder';
import { Types } from 'mongoose';

describe('NotificationBuilder', () => {
  describe('build', () => {
    it('should build notification object from DTO', () => {
      const dto = {
        recipientId: '507f1f77bcf86cd799439011',
        actorId: '507f1f77bcf86cd799439012',
        type: 'comment' as const,
        targetModel: 'Post' as const,
        targetId: '507f1f77bcf86cd799439013',
      };

      const builder = new NotificationBuilder();
      const result = builder.fromDTO(dto).build();

      expect(result).toHaveProperty('recipient');
      expect(result).toHaveProperty('actor');
      expect(result).toHaveProperty('type', 'comment');
      expect(result).toHaveProperty('targetModel', 'Post');
      expect(result).toHaveProperty('target');
      expect(result).toHaveProperty('read', false);
      expect(result.recipient).toBeInstanceOf(Types.ObjectId);
      expect(result.actor).toBeInstanceOf(Types.ObjectId);
      expect(result.target).toBeInstanceOf(Types.ObjectId);
    });

    it('should set individual fields', () => {
      const builder = new NotificationBuilder();
      const result = builder
        .setRecipient('507f1f77bcf86cd799439011')
        .setActor('507f1f77bcf86cd799439012')
        .setType('like')
        .setTargetModel('Comment')
        .setTarget('507f1f77bcf86cd799439013')
        .build();

      expect(result.type).toBe('like');
      expect(result.targetModel).toBe('Comment');
      expect(result.read).toBe(false);
    });

    it('should throw error when required fields are missing', () => {
      const builder = new NotificationBuilder();

      expect(() => builder.build()).toThrow('Missing required notification fields');
    });

    it('should throw error when only some fields are set', () => {
      const builder = new NotificationBuilder();
      builder
        .setRecipient('507f1f77bcf86cd799439011')
        .setActor('507f1f77bcf86cd799439012');

      expect(() => builder.build()).toThrow('Missing required notification fields');
    });

    it('should support fluent interface', () => {
      const builder = new NotificationBuilder();
      const result = builder
        .setRecipient('507f1f77bcf86cd799439011')
        .setActor('507f1f77bcf86cd799439012')
        .setType('follow')
        .setTargetModel('User')
        .setTarget('507f1f77bcf86cd799439013')
        .build();

      expect(result).toBeDefined();
      expect(result.type).toBe('follow');
    });
  });
});

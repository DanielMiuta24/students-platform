import { PublishEventBuilder } from '../../../modules/realtime/builders';
import type { BaseEventPayload } from '../../../modules/realtime/types';

describe('PublishEventBuilder', () => {
  const mockPayload: BaseEventPayload = {
    id: 'event-123',
    timestamp: new Date('2024-01-01'),
  };

  describe('build', () => {
    it('should build valid publish event DTO', () => {
      const dto = PublishEventBuilder.create()
        .setEvent('message:new')
        .setRoom('chat', 'chat-456')
        .setPayload(mockPayload)
        .build();

      expect(dto.event).toBe('message:new');
      expect(dto.room).toEqual({ type: 'chat', id: 'chat-456' });
      expect(dto.payload).toBe(mockPayload);
    });

    it('should build using setRoomIdentifier', () => {
      const dto = PublishEventBuilder.create()
        .setEvent('notification:new')
        .setRoomIdentifier({ type: 'user', id: 'user-789' })
        .setPayload(mockPayload)
        .build();

      expect(dto.event).toBe('notification:new');
      expect(dto.room).toEqual({ type: 'user', id: 'user-789' });
      expect(dto.payload).toBe(mockPayload);
    });

    it('should throw error when event name is missing', () => {
      const builder = PublishEventBuilder.create()
        .setRoom('user', '123')
        .setPayload(mockPayload);

      expect(() => builder.build()).toThrow('event name is required');
    });

    it('should throw error when room identifier is missing', () => {
      const builder = PublishEventBuilder.create()
        .setEvent('test:event')
        .setPayload(mockPayload);

      expect(() => builder.build()).toThrow('room identifier is required');
    });

    it('should throw error when payload is missing', () => {
      const builder = PublishEventBuilder.create()
        .setEvent('test:event')
        .setRoom('user', '123');

      expect(() => builder.build()).toThrow('payload is required');
    });

    it('should support method chaining', () => {
      const dto = PublishEventBuilder.create()
        .setEvent('comment:new')
        .setRoom('post', 'post-123')
        .setPayload(mockPayload)
        .build();

      expect(dto.event).toBe('comment:new');
      expect(dto.room.type).toBe('post');
      expect(dto.room.id).toBe('post-123');
    });

    it('should allow overwriting event name', () => {
      const dto = PublishEventBuilder.create()
        .setEvent('event:old')
        .setEvent('event:new')
        .setRoom('user', '123')
        .setPayload(mockPayload)
        .build();

      expect(dto.event).toBe('event:new');
    });

    it('should allow overwriting room', () => {
      const dto = PublishEventBuilder.create()
        .setEvent('test:event')
        .setRoom('chat', 'chat-1')
        .setRoom('user', 'user-1')
        .setPayload(mockPayload)
        .build();

      expect(dto.room).toEqual({ type: 'user', id: 'user-1' });
    });
  });

  describe('static factory methods', () => {
    describe('forUser', () => {
      it('should create builder with user room pre-set', () => {
        const dto = PublishEventBuilder.forUser('user-123')
          .setEvent('notification:new')
          .setPayload(mockPayload)
          .build();

        expect(dto.room).toEqual({ type: 'user', id: 'user-123' });
        expect(dto.event).toBe('notification:new');
      });
    });

    describe('forChat', () => {
      it('should create builder with chat room pre-set', () => {
        const dto = PublishEventBuilder.forChat('chat-456')
          .setEvent('message:new')
          .setPayload(mockPayload)
          .build();

        expect(dto.room).toEqual({ type: 'chat', id: 'chat-456' });
        expect(dto.event).toBe('message:new');
      });
    });

    describe('forPost', () => {
      it('should create builder with post room pre-set', () => {
        const dto = PublishEventBuilder.forPost('post-789')
          .setEvent('comment:new')
          .setPayload(mockPayload)
          .build();

        expect(dto.room).toEqual({ type: 'post', id: 'post-789' });
        expect(dto.event).toBe('comment:new');
      });
    });

    describe('forCommunity', () => {
      it('should create builder with community room pre-set', () => {
        const dto = PublishEventBuilder.forCommunity('community-abc')
          .setEvent('member:join')
          .setPayload(mockPayload)
          .build();

        expect(dto.room).toEqual({ type: 'community', id: 'community-abc' });
        expect(dto.event).toBe('member:join');
      });
    });

    it('should allow overriding pre-set room', () => {
      const dto = PublishEventBuilder.forUser('user-123')
        .setRoom('chat', 'chat-456')
        .setEvent('test:event')
        .setPayload(mockPayload)
        .build();

      expect(dto.room).toEqual({ type: 'chat', id: 'chat-456' });
    });
  });

  describe('create static method', () => {
    it('should create a new builder instance', () => {
      const builder = PublishEventBuilder.create();
      expect(builder).toBeInstanceOf(PublishEventBuilder);
    });

    it('should create independent builder instances', () => {
      const builder1 = PublishEventBuilder.create()
        .setEvent('event1')
        .setRoom('user', '1');
      const builder2 = PublishEventBuilder.create()
        .setEvent('event2')
        .setRoom('chat', '2');

      const dto1 = builder1.setPayload(mockPayload).build();
      const dto2 = builder2.setPayload(mockPayload).build();

      expect(dto1.event).toBe('event1');
      expect(dto2.event).toBe('event2');
      expect(dto1.room.type).toBe('user');
      expect(dto2.room.type).toBe('chat');
    });
  });

  describe('with custom payload types', () => {
    interface CustomPayload extends BaseEventPayload {
      userId: string;
      message: string;
    }

    it('should work with custom payload types', () => {
      const customPayload: CustomPayload = {
        id: 'custom-123',
        timestamp: new Date(),
        userId: 'user-456',
        message: 'Hello',
      };

      const dto = PublishEventBuilder.create<CustomPayload>()
        .setEvent('custom:event')
        .setRoom('user', 'user-456')
        .setPayload(customPayload)
        .build();

      expect(dto.payload.userId).toBe('user-456');
      expect(dto.payload.message).toBe('Hello');
    });
  });
});

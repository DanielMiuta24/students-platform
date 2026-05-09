import { EventPayloadBuilder } from '../../../modules/realtime/builders';
import type { BaseEventPayload } from '../../../modules/realtime/types';

describe('EventPayloadBuilder', () => {
  describe('build', () => {
    it('should build valid payload with required fields', () => {
      const payload = EventPayloadBuilder.create()
        .setId('event-123')
        .setTimestamp(new Date('2024-01-01'))
        .build();

      expect(payload.id).toBe('event-123');
      expect(payload.timestamp).toEqual(new Date('2024-01-01'));
    });

    it('should build payload with additional fields', () => {
      const payload = EventPayloadBuilder.create()
        .setId('event-456')
        .setTimestamp(new Date('2024-01-02'))
        .setField('userId', 'user-123')
        .setField('message', 'Hello World')
        .build();

      expect(payload.id).toBe('event-456');
      expect(payload.timestamp).toEqual(new Date('2024-01-02'));
      expect((payload as any).userId).toBe('user-123');
      expect((payload as any).message).toBe('Hello World');
    });

    it('should build payload using setFields for multiple fields', () => {
      const payload = EventPayloadBuilder.create()
        .setId('event-789')
        .setTimestamp(new Date('2024-01-03'))
        .setFields({
          userId: 'user-456',
          action: 'like',
          postId: 'post-123',
        })
        .build();

      expect(payload.id).toBe('event-789');
      expect((payload as any).userId).toBe('user-456');
      expect((payload as any).action).toBe('like');
      expect((payload as any).postId).toBe('post-123');
    });

    it('should throw error when id is missing', () => {
      const builder = EventPayloadBuilder.create().setTimestamp(new Date());

      expect(() => builder.build()).toThrow('id and timestamp are required fields');
    });

    it('should throw error when timestamp is missing', () => {
      const builder = EventPayloadBuilder.create().setId('event-123');

      expect(() => builder.build()).toThrow('id and timestamp are required fields');
    });

    it('should throw error when both id and timestamp are missing', () => {
      const builder = EventPayloadBuilder.create();

      expect(() => builder.build()).toThrow('id and timestamp are required fields');
    });

    it('should support method chaining', () => {
      const payload = EventPayloadBuilder.create()
        .setId('event-abc')
        .setTimestamp(new Date('2024-01-04'))
        .setField('field1', 'value1')
        .setField('field2', 'value2')
        .setFields({ field3: 'value3' })
        .build();

      expect(payload.id).toBe('event-abc');
      expect((payload as any).field1).toBe('value1');
      expect((payload as any).field2).toBe('value2');
      expect((payload as any).field3).toBe('value3');
    });

    it('should allow overwriting fields', () => {
      const payload = EventPayloadBuilder.create()
        .setId('event-xyz')
        .setTimestamp(new Date('2024-01-05'))
        .setField('status', 'pending')
        .setField('status', 'completed')
        .build();

      expect((payload as any).status).toBe('completed');
    });

    it('should merge fields correctly with setFields', () => {
      const payload = EventPayloadBuilder.create()
        .setId('event-merge')
        .setTimestamp(new Date('2024-01-06'))
        .setFields({ a: 1, b: 2 })
        .setFields({ b: 3, c: 4 })
        .build();

      expect((payload as any).a).toBe(1);
      expect((payload as any).b).toBe(3);
      expect((payload as any).c).toBe(4);
    });

    it('should handle complex nested objects', () => {
      const payload = EventPayloadBuilder.create()
        .setId('event-nested')
        .setTimestamp(new Date())
        .setField('user', { id: '123', name: 'John' })
        .setField('metadata', { tags: ['tag1', 'tag2'] })
        .build();

      expect((payload as any).user).toEqual({ id: '123', name: 'John' });
      expect((payload as any).metadata).toEqual({ tags: ['tag1', 'tag2'] });
    });
  });

  describe('create static method', () => {
    it('should create a new builder instance', () => {
      const builder = EventPayloadBuilder.create();
      expect(builder).toBeInstanceOf(EventPayloadBuilder);
    });

    it('should create independent builder instances', () => {
      const builder1 = EventPayloadBuilder.create().setId('id1');
      const builder2 = EventPayloadBuilder.create().setId('id2');

      const payload1 = builder1.setTimestamp(new Date()).build();
      const payload2 = builder2.setTimestamp(new Date()).build();

      expect(payload1.id).toBe('id1');
      expect(payload2.id).toBe('id2');
    });
  });
});

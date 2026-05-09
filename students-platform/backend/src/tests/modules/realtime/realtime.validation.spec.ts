import { RealtimeValidator } from '../../../modules/realtime/validators';
import type { RoomIdentifier, BaseEventPayload } from '../../../modules/realtime/types';

describe('RealtimeValidator', () => {
  describe('validateRoomIdentifier', () => {
    it('should return true for valid room identifier', () => {
      const room: RoomIdentifier = { type: 'user', id: '123' };
      expect(RealtimeValidator.validateRoomIdentifier(room)).toBe(true);
    });

    it('should return true for valid chat room', () => {
      const room: RoomIdentifier = { type: 'chat', id: 'chat-456' };
      expect(RealtimeValidator.validateRoomIdentifier(room)).toBe(true);
    });

    it('should return true for valid post room', () => {
      const room: RoomIdentifier = { type: 'post', id: 'post-789' };
      expect(RealtimeValidator.validateRoomIdentifier(room)).toBe(true);
    });

    it('should return true for custom room types', () => {
      const room: RoomIdentifier = { type: 'custom-room', id: 'xyz' };
      expect(RealtimeValidator.validateRoomIdentifier(room)).toBe(true);
    });

    it('should return false when room is null', () => {
      expect(RealtimeValidator.validateRoomIdentifier(null as any)).toBe(false);
    });

    it('should return false when room is undefined', () => {
      expect(RealtimeValidator.validateRoomIdentifier(undefined as any)).toBe(false);
    });

    it('should return false when type is empty string', () => {
      const room: RoomIdentifier = { type: '', id: '123' };
      expect(RealtimeValidator.validateRoomIdentifier(room)).toBe(false);
    });

    it('should return false when type is whitespace only', () => {
      const room: RoomIdentifier = { type: '   ', id: '123' };
      expect(RealtimeValidator.validateRoomIdentifier(room)).toBe(false);
    });

    it('should return false when id is empty string', () => {
      const room: RoomIdentifier = { type: 'user', id: '' };
      expect(RealtimeValidator.validateRoomIdentifier(room)).toBe(false);
    });

    it('should return false when id is whitespace only', () => {
      const room: RoomIdentifier = { type: 'user', id: '   ' };
      expect(RealtimeValidator.validateRoomIdentifier(room)).toBe(false);
    });

    it('should return false when type is missing', () => {
      const room = { id: '123' } as any;
      expect(RealtimeValidator.validateRoomIdentifier(room)).toBe(false);
    });

    it('should return false when id is missing', () => {
      const room = { type: 'user' } as any;
      expect(RealtimeValidator.validateRoomIdentifier(room)).toBe(false);
    });

    it('should return false when type is not a string', () => {
      const room = { type: 123, id: '123' } as any;
      expect(RealtimeValidator.validateRoomIdentifier(room)).toBe(false);
    });

    it('should return false when id is not a string', () => {
      const room = { type: 'user', id: 123 } as any;
      expect(RealtimeValidator.validateRoomIdentifier(room)).toBe(false);
    });
  });

  describe('validateBasePayload', () => {
    it('should return true for valid base payload', () => {
      const payload: BaseEventPayload = {
        id: 'event-123',
        timestamp: new Date(),
      };
      expect(RealtimeValidator.validateBasePayload(payload)).toBe(true);
    });

    it('should return true for valid payload with additional fields', () => {
      const payload = {
        id: 'event-123',
        timestamp: new Date(),
        userId: 'user-456',
        message: 'Hello',
      };
      expect(RealtimeValidator.validateBasePayload(payload)).toBe(true);
    });

    it('should return false when payload is null', () => {
      expect(RealtimeValidator.validateBasePayload(null)).toBe(false);
    });

    it('should return false when payload is undefined', () => {
      expect(RealtimeValidator.validateBasePayload(undefined)).toBe(false);
    });

    it('should return false when id is missing', () => {
      const payload = {
        timestamp: new Date(),
      };
      expect(RealtimeValidator.validateBasePayload(payload)).toBe(false);
    });

    it('should return false when timestamp is missing', () => {
      const payload = {
        id: 'event-123',
      };
      expect(RealtimeValidator.validateBasePayload(payload)).toBe(false);
    });

    it('should return false when id is empty string', () => {
      const payload = {
        id: '',
        timestamp: new Date(),
      };
      expect(RealtimeValidator.validateBasePayload(payload)).toBe(false);
    });

    it('should return false when id is whitespace only', () => {
      const payload = {
        id: '   ',
        timestamp: new Date(),
      };
      expect(RealtimeValidator.validateBasePayload(payload)).toBe(false);
    });

    it('should return false when id is not a string', () => {
      const payload = {
        id: 123,
        timestamp: new Date(),
      };
      expect(RealtimeValidator.validateBasePayload(payload)).toBe(false);
    });

    it('should return false when timestamp is not a Date', () => {
      const payload = {
        id: 'event-123',
        timestamp: '2024-01-01',
      };
      expect(RealtimeValidator.validateBasePayload(payload)).toBe(false);
    });

    it('should return false when timestamp is a number', () => {
      const payload = {
        id: 'event-123',
        timestamp: Date.now(),
      };
      expect(RealtimeValidator.validateBasePayload(payload)).toBe(false);
    });
  });

  describe('buildRoomName', () => {
    it('should build correct room name for user room', () => {
      const room: RoomIdentifier = { type: 'user', id: '123' };
      expect(RealtimeValidator.buildRoomName(room)).toBe('user:123');
    });

    it('should build correct room name for chat room', () => {
      const room: RoomIdentifier = { type: 'chat', id: 'chat-456' };
      expect(RealtimeValidator.buildRoomName(room)).toBe('chat:chat-456');
    });

    it('should build correct room name for post room', () => {
      const room: RoomIdentifier = { type: 'post', id: 'post-789' };
      expect(RealtimeValidator.buildRoomName(room)).toBe('post:post-789');
    });

    it('should build correct room name for custom room types', () => {
      const room: RoomIdentifier = { type: 'custom', id: 'xyz' };
      expect(RealtimeValidator.buildRoomName(room)).toBe('custom:xyz');
    });

    it('should throw error for invalid room identifier', () => {
      const room = { type: '', id: '123' } as RoomIdentifier;
      expect(() => RealtimeValidator.buildRoomName(room)).toThrow('Invalid room identifier');
    });

    it('should throw error when type is missing', () => {
      const room = { id: '123' } as any;
      expect(() => RealtimeValidator.buildRoomName(room)).toThrow('Invalid room identifier');
    });

    it('should throw error when id is missing', () => {
      const room = { type: 'user' } as any;
      expect(() => RealtimeValidator.buildRoomName(room)).toThrow('Invalid room identifier');
    });
  });
});

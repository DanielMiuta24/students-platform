import { realtimeService } from '../../../modules/realtime/services';
import { realtimeGateway } from '../../../modules/realtime/gateways';
import type { BaseEventPayload } from '../../../modules/realtime/types';

jest.mock('../../../modules/realtime/gateways', () => ({
  realtimeGateway: {
    getIO: jest.fn(),
    isUserOnline: jest.fn(),
    getActiveConnections: jest.fn(),
    getUserSocketIds: jest.fn(),
  },
}));

describe('RealtimeService', () => {
  let mockIO: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockIO = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    };

    (realtimeGateway.getIO as jest.Mock).mockReturnValue(mockIO);
  });

  describe('publishEvent', () => {
    const validPayload: BaseEventPayload = {
      id: 'event-123',
      timestamp: new Date('2024-01-01'),
    };

    it('should publish event to correct room', () => {
      realtimeService.publishEvent({
        event: 'message:new',
        room: { type: 'chat', id: 'chat-456' },
        payload: validPayload,
      });

      expect(mockIO.to).toHaveBeenCalledWith('chat:chat-456');
      expect(mockIO.emit).toHaveBeenCalledWith('message:new', validPayload);
    });

    it('should publish event with custom payload fields', () => {
      const customPayload = {
        ...validPayload,
        userId: 'user-789',
        message: 'Hello World',
      };

      realtimeService.publishEvent({
        event: 'custom:event',
        room: { type: 'user', id: 'user-789' },
        payload: customPayload,
      });

      expect(mockIO.to).toHaveBeenCalledWith('user:user-789');
      expect(mockIO.emit).toHaveBeenCalledWith('custom:event', customPayload);
    });

    it('should not publish when gateway is not initialized', () => {
      (realtimeGateway.getIO as jest.Mock).mockReturnValue(null);

      realtimeService.publishEvent({
        event: 'test:event',
        room: { type: 'user', id: '123' },
        payload: validPayload,
      });

      expect(mockIO.emit).not.toHaveBeenCalled();
    });

    it('should throw error for invalid room identifier', () => {
      expect(() => {
        realtimeService.publishEvent({
          event: 'test:event',
          room: { type: '', id: '123' } as any,
          payload: validPayload,
        });
      }).toThrow('INVALID_ROOM');
    });

    it('should throw error for empty event name', () => {
      expect(() => {
        realtimeService.publishEvent({
          event: '',
          room: { type: 'user', id: '123' },
          payload: validPayload,
        });
      }).toThrow('Invalid event name');
    });

    it('should throw error for whitespace-only event name', () => {
      expect(() => {
        realtimeService.publishEvent({
          event: '   ',
          room: { type: 'user', id: '123' },
          payload: validPayload,
        });
      }).toThrow('Invalid event name');
    });

    it('should throw error for invalid payload (missing id)', () => {
      expect(() => {
        realtimeService.publishEvent({
          event: 'test:event',
          room: { type: 'user', id: '123' },
          payload: { timestamp: new Date() } as any,
        });
      }).toThrow('INVALID_PAYLOAD');
    });

    it('should throw error for invalid payload (missing timestamp)', () => {
      expect(() => {
        realtimeService.publishEvent({
          event: 'test:event',
          room: { type: 'user', id: '123' },
          payload: { id: 'event-123' } as any,
        });
      }).toThrow('INVALID_PAYLOAD');
    });
  });

  describe('publishToRoom', () => {
    const validPayload: BaseEventPayload = {
      id: 'event-456',
      timestamp: new Date('2024-01-02'),
    };

    it('should publish to user room', () => {
      realtimeService.publishToRoom('user', 'user-123', 'notification:new', validPayload);

      expect(mockIO.to).toHaveBeenCalledWith('user:user-123');
      expect(mockIO.emit).toHaveBeenCalledWith('notification:new', validPayload);
    });

    it('should publish to chat room', () => {
      realtimeService.publishToRoom('chat', 'chat-456', 'message:new', validPayload);

      expect(mockIO.to).toHaveBeenCalledWith('chat:chat-456');
      expect(mockIO.emit).toHaveBeenCalledWith('message:new', validPayload);
    });

    it('should publish to post room', () => {
      realtimeService.publishToRoom('post', 'post-789', 'comment:new', validPayload);

      expect(mockIO.to).toHaveBeenCalledWith('post:post-789');
      expect(mockIO.emit).toHaveBeenCalledWith('comment:new', validPayload);
    });

    it('should publish to custom room types', () => {
      realtimeService.publishToRoom('livestream', 'stream-123', 'viewer:join', validPayload);

      expect(mockIO.to).toHaveBeenCalledWith('livestream:stream-123');
      expect(mockIO.emit).toHaveBeenCalledWith('viewer:join', validPayload);
    });
  });

  describe('publishToMultipleRooms', () => {
    const validPayload: BaseEventPayload = {
      id: 'event-multi',
      timestamp: new Date('2024-01-03'),
    };

    it('should publish to multiple rooms', () => {
      const rooms = [
        { type: 'user', id: 'user-1' },
        { type: 'user', id: 'user-2' },
        { type: 'user', id: 'user-3' },
      ];

      realtimeService.publishToMultipleRooms(rooms, 'broadcast:message', validPayload);

      expect(mockIO.to).toHaveBeenCalledTimes(3);
      expect(mockIO.emit).toHaveBeenCalledTimes(3);
      expect(mockIO.to).toHaveBeenNthCalledWith(1, 'user:user-1');
      expect(mockIO.to).toHaveBeenNthCalledWith(2, 'user:user-2');
      expect(mockIO.to).toHaveBeenNthCalledWith(3, 'user:user-3');
    });

    it('should handle empty rooms array', () => {
      realtimeService.publishToMultipleRooms([], 'test:event', validPayload);

      expect(mockIO.to).not.toHaveBeenCalled();
      expect(mockIO.emit).not.toHaveBeenCalled();
    });

    it('should publish to mixed room types', () => {
      const rooms = [
        { type: 'user', id: 'user-1' },
        { type: 'chat', id: 'chat-1' },
        { type: 'post', id: 'post-1' },
      ];

      realtimeService.publishToMultipleRooms(rooms, 'mixed:event', validPayload);

      expect(mockIO.to).toHaveBeenNthCalledWith(1, 'user:user-1');
      expect(mockIO.to).toHaveBeenNthCalledWith(2, 'chat:chat-1');
      expect(mockIO.to).toHaveBeenNthCalledWith(3, 'post:post-1');
    });
  });

  describe('isUserOnline', () => {
    it('should return true when user is online', () => {
      (realtimeGateway.isUserOnline as jest.Mock).mockReturnValue(true);

      const result = realtimeService.isUserOnline('user-123');

      expect(result).toBe(true);
      expect(realtimeGateway.isUserOnline).toHaveBeenCalledWith('user-123');
    });

    it('should return false when user is offline', () => {
      (realtimeGateway.isUserOnline as jest.Mock).mockReturnValue(false);

      const result = realtimeService.isUserOnline('user-456');

      expect(result).toBe(false);
      expect(realtimeGateway.isUserOnline).toHaveBeenCalledWith('user-456');
    });
  });

  describe('getOnlineUsersCount', () => {
    it('should return correct count of active connections', () => {
      (realtimeGateway.getActiveConnections as jest.Mock).mockReturnValue(42);

      const result = realtimeService.getOnlineUsersCount();

      expect(result).toBe(42);
      expect(realtimeGateway.getActiveConnections).toHaveBeenCalled();
    });

    it('should return 0 when no active connections', () => {
      (realtimeGateway.getActiveConnections as jest.Mock).mockReturnValue(0);

      const result = realtimeService.getOnlineUsersCount();

      expect(result).toBe(0);
    });
  });

  describe('getUserSocketIds', () => {
    it('should return array of socket IDs for user', () => {
      const mockSocketIds = ['socket-1', 'socket-2', 'socket-3'];
      (realtimeGateway.getUserSocketIds as jest.Mock).mockReturnValue(mockSocketIds);

      const result = realtimeService.getUserSocketIds('user-123');

      expect(result).toEqual(mockSocketIds);
      expect(realtimeGateway.getUserSocketIds).toHaveBeenCalledWith('user-123');
    });

    it('should return empty array when user has no active sockets', () => {
      (realtimeGateway.getUserSocketIds as jest.Mock).mockReturnValue([]);

      const result = realtimeService.getUserSocketIds('user-456');

      expect(result).toEqual([]);
    });
  });
});

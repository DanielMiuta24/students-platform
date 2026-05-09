import type { Server as HTTPServer } from 'http';
import { Server, type Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../../../config/env';
import type { AuthenticatedSocket, RoomIdentifier, ConnectionInfo } from '../types';
import { REALTIME_CONFIG, REALTIME_ERROR } from '../constants';
import { RealtimeValidator } from '../validators';

interface JwtPayload {
  sub: string;
  email: string;
  type: string;
}

export class RealtimeGateway {
  private io: Server | null = null;
  private connections: Map<string, ConnectionInfo> = new Map();
  private userSocketMap: Map<string, Set<string>> = new Map();

  initialize(httpServer: HTTPServer): void {
    if (this.io) {
      return;
    }

    this.io = new Server(httpServer, {
      cors: REALTIME_CONFIG.CORS,
      pingTimeout: REALTIME_CONFIG.PING_TIMEOUT,
      pingInterval: REALTIME_CONFIG.PING_INTERVAL,
    });

    this.setupMiddleware();
    this.setupConnectionHandlers();
  }

  private setupMiddleware(): void {
    if (!this.io) return;

    this.io.use(async (socket: Socket, next) => {
      try {
        // Try to get token from: auth, authorization header, or cookie
        let token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');

        // If no token in auth or header, try to get it from cookie
        if (!token && socket.handshake.headers.cookie) {
          const cookies = socket.handshake.headers.cookie.split(';').reduce((acc: Record<string, string>, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = value;
            return acc;
          }, {});
          token = cookies.token;
        }

        if (!token) {
          return next(new Error(REALTIME_ERROR.UNAUTHORIZED));
        }

        const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

        const authSocket = socket as AuthenticatedSocket;
        authSocket.userId = decoded.sub;
        authSocket.email = decoded.email;
        authSocket.userType = decoded.type;

        next();
      } catch (error) {
        next(new Error(REALTIME_ERROR.UNAUTHORIZED));
      }
    });
  }

  private setupConnectionHandlers(): void {
    if (!this.io) return;

    this.io.on('connection', (socket: Socket) => {
      const authSocket = socket as AuthenticatedSocket;

      if (!authSocket.userId) {
        socket.disconnect();
        return;
      }

      this.handleConnection(authSocket);
      this.setupEventHandlers(authSocket);
    });
  }

  private handleConnection(socket: AuthenticatedSocket): void {
    const userId = socket.userId!;
    const connectionInfo: ConnectionInfo = {
      socketId: socket.id,
      userId,
      connectedAt: new Date(),
      rooms: [],
    };

    this.connections.set(socket.id, connectionInfo);

    if (!this.userSocketMap.has(userId)) {
      this.userSocketMap.set(userId, new Set());
    }
    this.userSocketMap.get(userId)!.add(socket.id);

    const userRoom = RealtimeValidator.buildRoomName({
      type: 'user',
      id: userId,
    });
    socket.join(userRoom);
    connectionInfo.rooms.push(userRoom);

    socket.on('disconnect', () => this.handleDisconnection(socket));
  }

  private setupEventHandlers(socket: AuthenticatedSocket): void {
    socket.on('join:room', (room: RoomIdentifier, callback) => {
      try {
        if (!RealtimeValidator.validateRoomIdentifier(room)) {
          callback?.({ success: false, error: REALTIME_ERROR.INVALID_ROOM });
          return;
        }

        const roomName = RealtimeValidator.buildRoomName(room);
        socket.join(roomName);

        const connectionInfo = this.connections.get(socket.id);
        if (connectionInfo && !connectionInfo.rooms.includes(roomName)) {
          connectionInfo.rooms.push(roomName);
        }

        callback?.({ success: true, room: roomName });
      } catch (error) {
        callback?.({ success: false, error: REALTIME_ERROR.INVALID_ROOM });
      }
    });

    socket.on('leave:room', (room: RoomIdentifier, callback) => {
      try {
        if (!RealtimeValidator.validateRoomIdentifier(room)) {
          callback?.({ success: false, error: REALTIME_ERROR.INVALID_ROOM });
          return;
        }

        const roomName = RealtimeValidator.buildRoomName(room);
        socket.leave(roomName);

        const connectionInfo = this.connections.get(socket.id);
        if (connectionInfo) {
          connectionInfo.rooms = connectionInfo.rooms.filter(r => r !== roomName);
        }

        callback?.({ success: true, room: roomName });
      } catch (error) {
        callback?.({ success: false, error: REALTIME_ERROR.INVALID_ROOM });
      }
    });
  }

  private handleDisconnection(socket: AuthenticatedSocket): void {
    const userId = socket.userId;
    const socketId = socket.id;

    this.connections.delete(socketId);

    if (userId) {
      const userSockets = this.userSocketMap.get(userId);
      if (userSockets) {
        userSockets.delete(socketId);
        if (userSockets.size === 0) {
          this.userSocketMap.delete(userId);
        }
      }
    }
  }

  getIO(): Server | null {
    return this.io;
  }

  getActiveConnections(): number {
    return this.connections.size;
  }

  getUserSocketIds(userId: string): string[] {
    const sockets = this.userSocketMap.get(userId);
    return sockets ? Array.from(sockets) : [];
  }

  isUserOnline(userId: string): boolean {
    return this.userSocketMap.has(userId) && this.userSocketMap.get(userId)!.size > 0;
  }
}

export const realtimeGateway = new RealtimeGateway();

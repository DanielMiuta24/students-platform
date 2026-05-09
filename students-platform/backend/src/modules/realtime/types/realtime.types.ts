import type { Socket } from 'socket.io';

export interface AuthenticatedSocket extends Socket {
  userId?: string;
  email?: string;
  userType?: string;
}

export interface RoomIdentifier {
  type: string;
  id: string;
}

export interface BaseEventPayload {
  id: string;
  timestamp: Date;
  [key: string]: any;
}

export interface PublishEventDTO<T extends BaseEventPayload = BaseEventPayload> {
  event: string;
  room: RoomIdentifier;
  payload: T;
}

export interface ConnectionInfo {
  socketId: string;
  userId: string;
  connectedAt: Date;
  rooms: string[];
}

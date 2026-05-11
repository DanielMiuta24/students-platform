import { realtimeGateway } from '../gateways';
import type {
  PublishEventDTO,
  BaseEventPayload,
} from '../types';
import { RealtimeValidator } from '../validators';
import { REALTIME_ERROR } from '../constants';
import { PublishEventBuilder } from '../builders';

export class RealtimeService {
  publishEvent<T extends BaseEventPayload = BaseEventPayload>(dto: PublishEventDTO<T>): void {
    const io = realtimeGateway.getIO();

    if (!io) {
      return;
    }

    if (!RealtimeValidator.validateRoomIdentifier(dto.room)) {
      throw new Error(REALTIME_ERROR.INVALID_ROOM);
    }

    if (!dto.event || typeof dto.event !== 'string' || dto.event.trim().length === 0) {
      throw new Error('Invalid event name');
    }

    if (!RealtimeValidator.validateBasePayload(dto.payload)) {
      throw new Error(REALTIME_ERROR.INVALID_PAYLOAD);
    }

    const roomName = RealtimeValidator.buildRoomName(dto.room);

    io.to(roomName).emit(dto.event, dto.payload);
  }

  publishToRoom(roomType: string, roomId: string, event: string, payload: BaseEventPayload): void {
    const dto = PublishEventBuilder.create()
      .setRoom(roomType, roomId)
      .setEvent(event)
      .setPayload(payload)
      .build();

    this.publishEvent(dto);
  }

  publishToMultipleRooms(rooms: Array<{ type: string; id: string }>, event: string, payload: BaseEventPayload): void {
    const io = realtimeGateway.getIO();

    for (const room of rooms) {
      const dto = PublishEventBuilder.create()
        .setRoom(room.type, room.id)
        .setEvent(event)
        .setPayload(payload)
        .build();

      const roomName = RealtimeValidator.buildRoomName(room);

      // Log which sockets are in this room
      const socketsInRoom = io?.sockets.adapter.rooms.get(roomName);
      console.log(`[RealtimeService] Publishing event "${event}" to room: ${roomName}`);
      console.log(`[RealtimeService] Sockets in room ${roomName}:`, socketsInRoom ? Array.from(socketsInRoom) : 'NONE');

      this.publishEvent(dto);
    }
  }

  isUserOnline(userId: string): boolean {
    return realtimeGateway.isUserOnline(userId);
  }

  getOnlineUsersCount(): number {
    return realtimeGateway.getActiveConnections();
  }

  getUserSocketIds(userId: string): string[] {
    return realtimeGateway.getUserSocketIds(userId);
  }
}

export const realtimeService = new RealtimeService();

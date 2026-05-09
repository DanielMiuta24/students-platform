import type { RoomIdentifier, BaseEventPayload } from '../types';

export class RealtimeValidator {
  static validateRoomIdentifier(room: RoomIdentifier): boolean {
    if (!room || typeof room !== 'object') {
      return false;
    }

    if (!room.type || typeof room.type !== 'string' || room.type.trim().length === 0) {
      return false;
    }

    if (!room.id || typeof room.id !== 'string' || room.id.trim().length === 0) {
      return false;
    }

    return true;
  }

  static validateBasePayload(payload: any): payload is BaseEventPayload {
    return !!(
      payload &&
      typeof payload === 'object' &&
      typeof payload.id === 'string' &&
      payload.id.trim().length > 0 &&
      payload.timestamp instanceof Date
    );
  }

  static buildRoomName(room: RoomIdentifier): string {
    if (!this.validateRoomIdentifier(room)) {
      throw new Error('Invalid room identifier');
    }
    return `${room.type}:${room.id}`;
  }
}

import type { PublishEventDTO, RoomIdentifier, BaseEventPayload } from '../types';

export class PublishEventBuilder<T extends BaseEventPayload = BaseEventPayload> {
  private eventName?: string;
  private roomIdentifier?: RoomIdentifier;
  private eventPayload?: T;

  setEvent(event: string): this {
    this.eventName = event;
    return this;
  }

  setRoom(type: string, id: string): this {
    this.roomIdentifier = { type, id };
    return this;
  }

  setRoomIdentifier(room: RoomIdentifier): this {
    this.roomIdentifier = room;
    return this;
  }

  setPayload(payload: T): this {
    this.eventPayload = payload;
    return this;
  }

  build(): PublishEventDTO<T> {
    if (!this.eventName) {
      throw new Error('PublishEventBuilder: event name is required');
    }
    if (!this.roomIdentifier) {
      throw new Error('PublishEventBuilder: room identifier is required');
    }
    if (!this.eventPayload) {
      throw new Error('PublishEventBuilder: payload is required');
    }

    return {
      event: this.eventName,
      room: this.roomIdentifier,
      payload: this.eventPayload,
    };
  }

  static create<T extends BaseEventPayload = BaseEventPayload>(): PublishEventBuilder<T> {
    return new PublishEventBuilder<T>();
  }

  static forUser<T extends BaseEventPayload = BaseEventPayload>(userId: string): PublishEventBuilder<T> {
    return new PublishEventBuilder<T>().setRoom('user', userId);
  }

  static forChat<T extends BaseEventPayload = BaseEventPayload>(chatId: string): PublishEventBuilder<T> {
    return new PublishEventBuilder<T>().setRoom('chat', chatId);
  }

  static forPost<T extends BaseEventPayload = BaseEventPayload>(postId: string): PublishEventBuilder<T> {
    return new PublishEventBuilder<T>().setRoom('post', postId);
  }

  static forCommunity<T extends BaseEventPayload = BaseEventPayload>(communityId: string): PublishEventBuilder<T> {
    return new PublishEventBuilder<T>().setRoom('community', communityId);
  }
}

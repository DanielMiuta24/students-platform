import type { BaseEventPayload } from '../types';

export class EventPayloadBuilder<T extends BaseEventPayload = BaseEventPayload> {
  private payload: Partial<T> = {};

  setId(id: string): this {
    this.payload.id = id;
    return this;
  }

  setTimestamp(timestamp: Date): this {
    this.payload.timestamp = timestamp;
    return this;
  }

  setField<K extends keyof T>(key: K, value: T[K]): this {
    this.payload[key] = value;
    return this;
  }

  setFields(fields: Partial<T>): this {
    this.payload = { ...this.payload, ...fields };
    return this;
  }

  build(): T {
    if (!this.payload.id || !this.payload.timestamp) {
      throw new Error('EventPayloadBuilder: id and timestamp are required fields');
    }

    return this.payload as T;
  }

  static create<T extends BaseEventPayload = BaseEventPayload>(): EventPayloadBuilder<T> {
    return new EventPayloadBuilder<T>();
  }
}

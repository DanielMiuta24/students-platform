import type { CreateNotificationDTO } from '../types';
import type { NotificationType, TargetModel } from '../../../shared/types/domain';
import { Types } from 'mongoose';

export class NotificationBuilder {
  private recipientId?: Types.ObjectId;
  private actorId?: Types.ObjectId;
  private type?: NotificationType;
  private targetModel?: TargetModel;
  private targetId?: Types.ObjectId;

  setRecipient(recipientId: string): this {
    this.recipientId = new Types.ObjectId(recipientId);
    return this;
  }

  setActor(actorId: string): this {
    this.actorId = new Types.ObjectId(actorId);
    return this;
  }

  setType(type: NotificationType): this {
    this.type = type;
    return this;
  }

  setTargetModel(targetModel: TargetModel): this {
    this.targetModel = targetModel;
    return this;
  }

  setTarget(targetId: string): this {
    this.targetId = new Types.ObjectId(targetId);
    return this;
  }

  fromDTO(dto: CreateNotificationDTO): this {
    return this
      .setRecipient(dto.recipientId)
      .setActor(dto.actorId)
      .setType(dto.type)
      .setTargetModel(dto.targetModel)
      .setTarget(dto.targetId);
  }

  build() {
    if (!this.recipientId || !this.actorId || !this.type || !this.targetModel || !this.targetId) {
      throw new Error('Missing required notification fields');
    }

    return {
      recipient: this.recipientId,
      actor: this.actorId,
      type: this.type,
      targetModel: this.targetModel,
      target: this.targetId,
      read: false,
    };
  }
}

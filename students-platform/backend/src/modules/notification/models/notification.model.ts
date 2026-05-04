import {
  Schema,
  model,
  type InferSchemaType,
  type HydratedDocument,
  type Model,
} from 'mongoose';
import {
  NOTIFICATION_TYPES,
  TARGET_MODELS,
  type NotificationType,
  type TargetModel,
} from '@/shared/types';

const NotificationSchema = new Schema(
  {
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    actor:     { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    type: { type: String, enum: NOTIFICATION_TYPES, required: true, index: true } as {
      type: String; enum: readonly NotificationType[];
    },

    targetModel: { type: String, enum: TARGET_MODELS, required: true } as {
      type: String; enum: readonly TargetModel[];
    },

    target: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'targetModel',
      index: true,
    },

    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);


export type Notification = InferSchemaType<typeof NotificationSchema>;
export type NotificationDoc = HydratedDocument<Notification>;


NotificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ recipient: 1, createdAt: -1 });
NotificationSchema.index({ actor: 1, type: 1, createdAt: -1 });
NotificationSchema.index({ target: 1, targetModel: 1 });


export const NotificationModel: Model<Notification> =
  model<Notification>('Notification', NotificationSchema);

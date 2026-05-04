import {
  Schema,
  model,
  type InferSchemaType,
  type HydratedDocument,
  type Model,
} from 'mongoose';
import type { AttachmentMeta } from '@/shared/types/files';


const AttachmentSchema = new Schema<AttachmentMeta>(
  {
    filename:   { type: String, required: true },
    mimeType:   { type: String, required: true },
    sizeBytes:  { type: Number, required: true, min: 0 },
    storageUrl: { type: String, required: true },
  },
  { _id: true, _idRequired: false }
);


const MessageSchema = new Schema(
  {
    sender:    { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    content:   { type: String, required: true },
    attachments: { type: [AttachmentSchema], default: [] },
  },
  { timestamps: true }
);


export type Message = InferSchemaType<typeof MessageSchema>;
export type MessageDoc = HydratedDocument<Message>;


MessageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });


export const MessageModel: Model<Message> = model<Message>('Message', MessageSchema);

import {
  Schema,
  model,
  type InferSchemaType,
  type HydratedDocument,
  type Model,
} from 'mongoose';
import type { AttachmentMeta } from '../../../shared/types/files';


const AttachmentSchema = new Schema<AttachmentMeta>(
  {
    filename:   { type: String, required: true },
    mimeType:   { type: String, required: true },
    sizeBytes:  { type: Number, required: true, min: 0 },
    storageUrl: { type: String, required: true },
  },
  { _id: false }
);


const MessageSchema = new Schema(
  {
    sender:    { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    content:   { type: String, required: true },
    attachments: { type: [AttachmentSchema], default: [] },
    isRead:    { type: Boolean, default: false, index: true },
    readAt:    { type: Date, default: null },
    isEdited:  { type: Boolean, default: false },
    editedAt:  { type: Date, default: null },
    isDeletedForEveryone: { type: Boolean, default: false },
    deletedForSender: { type: Boolean, default: false },
    deletedForRecipient: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);


export type Message = InferSchemaType<typeof MessageSchema>;
export type MessageDoc = HydratedDocument<Message>;


MessageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });
MessageSchema.index({ recipient: 1, isRead: 1 });


export const MessageModel: Model<Message> = model<Message>('Message', MessageSchema);

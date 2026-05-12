import {
  Schema,
  model,
  type InferSchemaType,
  type HydratedDocument,
  type Model,
} from 'mongoose';

const OwnershipTransferSchema = new Schema(
  {
    community: { type: Schema.Types.ObjectId, ref: 'Community', required: true } as {
      type: typeof Schema.Types.ObjectId; ref: 'Community';
    },
    currentOwner: { type: Schema.Types.ObjectId, ref: 'User', required: true } as {
      type: typeof Schema.Types.ObjectId; ref: 'User';
    },
    newOwner: { type: Schema.Types.ObjectId, ref: 'User', required: true } as {
      type: typeof Schema.Types.ObjectId; ref: 'User';
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'cancelled', 'expired'],
      default: 'pending',
    },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export type OwnershipTransfer = InferSchemaType<typeof OwnershipTransferSchema>;
export type OwnershipTransferDoc = HydratedDocument<OwnershipTransfer>;

OwnershipTransferSchema.index({ community: 1, status: 1 });
OwnershipTransferSchema.index({ newOwner: 1, status: 1 });
OwnershipTransferSchema.index({ expiresAt: 1 });

export const OwnershipTransferModel: Model<OwnershipTransfer> = model<OwnershipTransfer>(
  'OwnershipTransfer',
  OwnershipTransferSchema
);

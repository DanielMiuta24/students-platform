import {
  Schema,
  model,
  type InferSchemaType,
  type HydratedDocument,
  type Model,
} from 'mongoose';

const CommunityJoinRequestSchema = new Schema(
  {
    community: { type: Schema.Types.ObjectId, ref: 'Community', required: true } as {
      type: typeof Schema.Types.ObjectId; ref: 'Community';
    },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true } as {
      type: typeof Schema.Types.ObjectId; ref: 'User';
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    message: { type: String, trim: true },
  },
  { timestamps: true }
);

export type CommunityJoinRequest = InferSchemaType<typeof CommunityJoinRequestSchema>;
export type CommunityJoinRequestDoc = HydratedDocument<CommunityJoinRequest>;

CommunityJoinRequestSchema.index({ community: 1, status: 1 });
CommunityJoinRequestSchema.index({ user: 1, community: 1 }, { unique: true });

export const CommunityJoinRequestModel: Model<CommunityJoinRequest> = model<CommunityJoinRequest>(
  'CommunityJoinRequest',
  CommunityJoinRequestSchema
);

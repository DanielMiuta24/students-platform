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

CommunityJoinRequestSchema.pre('deleteOne', { document: true, query: false }, async function() {
  const NotificationModel = model('Notification');
  await NotificationModel.deleteMany({ target: this._id, targetModel: 'CommunityJoinRequest' });
});

CommunityJoinRequestSchema.pre('findOneAndDelete', async function() {
  const doc = await this.model.findOne(this.getQuery());
  if (doc) {
    const NotificationModel = model('Notification');
    await NotificationModel.deleteMany({ target: doc._id, targetModel: 'CommunityJoinRequest' });
  }
});

export const CommunityJoinRequestModel: Model<CommunityJoinRequest> = model<CommunityJoinRequest>(
  'CommunityJoinRequest',
  CommunityJoinRequestSchema
);

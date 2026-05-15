import {
  Schema,
  model,
  type InferSchemaType,
  type HydratedDocument,
  type Model,
} from 'mongoose';
import { COMMUNITY_ROLE, COMMUNITY_VISIBILITY } from '../constants';

const CommunityMemberSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: Object.values(COMMUNITY_ROLE), default: COMMUNITY_ROLE.MEMBER },
  joinedAt: { type: Date, default: Date.now },
}, { _id: false });

const CommunitySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, trim: true },
    rules: { type: String, trim: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true } as {
      type: typeof Schema.Types.ObjectId; ref: 'Category';
    },
    coverImage: { type: Schema.Types.ObjectId, ref: 'Image' } as {
      type: typeof Schema.Types.ObjectId; ref: 'Image';
    },
    founder: { type: Schema.Types.ObjectId, ref: 'User', required: true } as {
      type: typeof Schema.Types.ObjectId; ref: 'User';
    },
    members: [CommunityMemberSchema],
    bannedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    memberCount: { type: Number, default: 1, min: 0 },
    postCount: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
    visibility: { type: String, enum: Object.values(COMMUNITY_VISIBILITY), default: COMMUNITY_VISIBILITY.PUBLIC, required: true },
    requiresApproval: { type: Boolean, default: false },
    allowMemberPosts: { type: Boolean, default: true },
    allowMemberInvites: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type Community = InferSchemaType<typeof CommunitySchema>;
export type CommunityDoc = HydratedDocument<Community>;

CommunitySchema.index({ founder: 1, _id: -1 });
CommunitySchema.index({ category: 1, isActive: 1, _id: -1 });
CommunitySchema.index({ 'members.user': 1 });
CommunitySchema.index({ isActive: 1, memberCount: -1 });

CommunitySchema.pre('deleteOne', { document: true, query: false }, async function() {
  const NotificationModel = model('Notification');
  await NotificationModel.deleteMany({ target: this._id, targetModel: 'Community' });
});

CommunitySchema.pre('findOneAndDelete', async function() {
  const doc = await this.model.findOne(this.getQuery());
  if (doc) {
    const NotificationModel = model('Notification');
    await NotificationModel.deleteMany({ target: doc._id, targetModel: 'Community' });
  }
});

export const CommunityModel: Model<Community> = model<Community>('Community', CommunitySchema);

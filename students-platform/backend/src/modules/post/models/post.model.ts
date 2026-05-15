import {
  Schema,
  model,
  type InferSchemaType,
  type HydratedDocument,
  type Model,
  type Types,
} from 'mongoose';
import { POST_STATUS, POST_VISIBILITY } from '../../../shared/constants';
import type { PostContent } from '../types/post-content.types';

export type RichText = PostContent;

const PostSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true } as {
      type: typeof Schema.Types.ObjectId; ref: 'User';
    },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    content: { type: Schema.Types.Mixed as unknown as RichText, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: false } as {
      type: typeof Schema.Types.ObjectId; ref: 'Category';
    },
    community: { type: Schema.Types.ObjectId, ref: 'Community', required: false } as {
      type: typeof Schema.Types.ObjectId; ref: 'Community';
    },
    status: {
      type: String,
      enum: Object.values(POST_STATUS),
      default: POST_STATUS.DRAFT,
      required: true
    },
    visibility: {
      type: String,
      enum: Object.values(POST_VISIBILITY),
      default: POST_VISIBILITY.PUBLIC,
      required: true
    },
    isPinned: { type: Boolean, default: false },
    images: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
      default: [],
    },
    likeCount: { type: Number, default: 0, min: 0 },
    commentCount: { type: Number, default: 0, min: 0 },
    viewCount: { type: Number, default: 0, min: 0 },
    viewedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);


export type Post = InferSchemaType<typeof PostSchema>;
export type PostDoc = HydratedDocument<Post>;

PostSchema.index({ status: 1, visibility: 1, _id: -1 });
PostSchema.index({ author: 1, _id: -1 });
PostSchema.index({ category: 1, status: 1, visibility: 1, _id: -1 });
PostSchema.index({ community: 1, status: 1, visibility: 1, _id: -1 });
PostSchema.index({ community: 1, isPinned: -1, _id: -1 });

PostSchema.pre('deleteOne', { document: true, query: false }, async function() {
  const NotificationModel = model('Notification');
  await NotificationModel.deleteMany({ target: this._id, targetModel: 'Post' });
});

PostSchema.pre('findOneAndDelete', async function() {
  const doc = await this.model.findOne(this.getQuery());
  if (doc) {
    const NotificationModel = model('Notification');
    await NotificationModel.deleteMany({ target: doc._id, targetModel: 'Post' });
  }
});

export const PostModel: Model<Post> = model<Post>('Post', PostSchema);

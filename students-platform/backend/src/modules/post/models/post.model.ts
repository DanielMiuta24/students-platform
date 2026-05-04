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
    content: { type: Schema.Types.Mixed as unknown as RichText, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: false } as {
      type: typeof Schema.Types.ObjectId; ref: 'Category';
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
    images: {
      type: [{
        url: { type: String, required: true },
        alt: { type: String, default: '' }
      }]
    },
    likeCount: { type: Number, default: 0, min: 0 },
    commentCount: { type: Number, default: 0, min: 0 },
    viewCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);


export type Post = InferSchemaType<typeof PostSchema>;
export type PostDoc = HydratedDocument<Post>;

// Index for public feed queries (status + visibility + _id for cursor pagination)
PostSchema.index({ status: 1, visibility: 1, _id: -1 });

// Index for author's posts feed (sorted by _id for cursor pagination)
PostSchema.index({ author: 1, _id: -1 });

// Index for category-based feed (includes visibility for proper filtering)
PostSchema.index({ category: 1, status: 1, visibility: 1, _id: -1 });

export const PostModel: Model<Post> = model<Post>('Post', PostSchema);

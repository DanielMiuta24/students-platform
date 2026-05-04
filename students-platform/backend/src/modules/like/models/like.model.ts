import {
  Schema,
  model,
  type InferSchemaType,
  type HydratedDocument,
  type Model,
} from 'mongoose';

export type LikeableType = 'Post' | 'Comment';

const LikeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    } as { type: typeof Schema.Types.ObjectId; ref: 'User' },
    likeable: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    likeableType: {
      type: String,
      enum: ['Post', 'Comment'],
      required: true,
    },
  },
  { timestamps: true }
);

// Compound unique index to prevent duplicate likes
LikeSchema.index({ user: 1, likeable: 1, likeableType: 1 }, { unique: true });

// Index for querying likes by likeable entity
LikeSchema.index({ likeable: 1, likeableType: 1 });

// Index for querying likes by user
LikeSchema.index({ user: 1 });

export type Like = InferSchemaType<typeof LikeSchema>;
export type LikeDoc = HydratedDocument<Like>;

export const LikeModel: Model<Like> = model<Like>('Like', LikeSchema);

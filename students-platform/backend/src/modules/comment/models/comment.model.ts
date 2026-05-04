import {
  Schema,
  model,
  type InferSchemaType,
  type HydratedDocument,
  type Model,
} from 'mongoose';

const CommentSchema = new Schema(
  {
    post:   { type: Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    content: { type: String, required: true, trim: true },
    parentComment: { type: Schema.Types.ObjectId, ref: 'Comment', default: null, index: true },
    likeCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);


export type Comment = InferSchemaType<typeof CommentSchema>;
export type CommentDoc = HydratedDocument<Comment>;


CommentSchema.index({ createdAt: 1 });


export const CommentModel: Model<Comment> = model<Comment>('Comment', CommentSchema);

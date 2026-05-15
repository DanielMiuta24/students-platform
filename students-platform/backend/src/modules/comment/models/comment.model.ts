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

CommentSchema.pre('deleteOne', { document: true, query: false }, async function() {
  const NotificationModel = model('Notification');
  await NotificationModel.deleteMany({ target: this._id, targetModel: 'Comment' });
});

CommentSchema.pre('findOneAndDelete', async function() {
  const doc = await this.model.findOne(this.getQuery());
  if (doc) {
    const NotificationModel = model('Notification');
    await NotificationModel.deleteMany({ target: doc._id, targetModel: 'Comment' });
  }
});

export const CommentModel: Model<Comment> = model<Comment>('Comment', CommentSchema);

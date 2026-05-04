import { CommentModel, type CommentDoc } from './comment.model';
import { PostModel } from '../post/models/post.model';

export interface CreateCommentDTO {
  postId: string;
  authorId: string;
  content: string;
  parentCommentId?: string;
}

export interface UpdateCommentDTO {
  content: string;
}

export interface GetCommentsDTO {
  postId: string;
  page?: number;
  limit?: number;
  parentCommentId?: string | null;
}

export interface SafeComment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  parentCommentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class CommentService {
  async createComment(data: CreateCommentDTO): Promise<CommentDoc> {

    const postExists = await PostModel.exists({ _id: data.postId });
    if (!postExists) {
      throw new Error('POST_NOT_FOUND');
    }


    if (data.parentCommentId) {
      const parentExists = await CommentModel.exists({ _id: data.parentCommentId });
      if (!parentExists) {
        throw new Error('PARENT_COMMENT_NOT_FOUND');
      }
    }

    const comment = new CommentModel({
      post: data.postId,
      author: data.authorId,
      content: data.content.trim(),
      parentComment: data.parentCommentId || null,
    });

    return comment.save();
  }

  async getCommentById(commentId: string): Promise<CommentDoc | null> {
    return CommentModel.findById(commentId)
      .populate('author', 'name username avatar')
      .populate('post', 'title')
      .exec();
  }

  async getCommentsByPost(data: GetCommentsDTO): Promise<{ comments: CommentDoc[]; total: number; page: number; limit: number }> {
    const { postId, page = 1, limit = 10, parentCommentId = null } = data;

    const query: any = { post: postId };

    if (parentCommentId === null) {
      query.parentComment = null;
    } else if (parentCommentId) {
      query.parentComment = parentCommentId;
    }

    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      CommentModel.find(query)
        .populate('author', 'name username avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      CommentModel.countDocuments(query),
    ]);

    return { comments, total, page, limit };
  }

  async updateComment(commentId: string, data: UpdateCommentDTO): Promise<CommentDoc | null> {
    const comment = await CommentModel.findByIdAndUpdate(
      commentId,
      { content: data.content.trim() },
      { new: true, runValidators: true }
    )
      .populate('author', 'name username avatar')
      .exec();

    return comment;
  }

  async deleteComment(commentId: string): Promise<void> {
    await CommentModel.findByIdAndDelete(commentId);

    await CommentModel.deleteMany({ parentComment: commentId });
  }

  async getCommentCount(postId: string): Promise<number> {
    return CommentModel.countDocuments({ post: postId });
  }

  async getRepliesCount(commentId: string): Promise<number> {
    return CommentModel.countDocuments({ parentComment: commentId });
  }

  verifyCommentOwnership(comment: CommentDoc, userId: string): boolean {
    return comment.author.toString() === userId;
  }

  toSafeComment(comment: CommentDoc): SafeComment {
    return {
      id: comment._id.toString(),
      postId: comment.post.toString(),
      authorId: comment.author.toString(),
      content: comment.content,
      parentCommentId: comment.parentComment ? comment.parentComment.toString() : null,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }
}

export const commentService = new CommentService();

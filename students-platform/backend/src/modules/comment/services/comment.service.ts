import { CommentModel, type CommentDoc } from '../models';
import { PostModel } from '../../post/models';
import { LikeModel } from '../../like/models';
import { realtimeService } from '../../realtime/services';

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
  author?: {
    name: string;
    username: string;
    avatar?: string;
  };
  content: string;
  parentCommentId: string | null;
  likeCount: number;
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

    await comment.save();

    // Increment the post's comment count
    await PostModel.findByIdAndUpdate(data.postId, { $inc: { commentCount: 1 } });

    // Populate author data before returning
    await comment.populate('author', 'name username avatar');

    // Emit realtime event
    realtimeService.publishToRoom('post', data.postId, 'comment:created', {
      id: comment._id.toString(),
      timestamp: new Date(),
      data: this.toSafeComment(comment),
    });

    return comment;
  }

  async getCommentById(commentId: string): Promise<CommentDoc | null> {
    return CommentModel.findById(commentId)
      .populate('author', 'name username avatar')
      .populate('post', 'title author')
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

    if (comment) {
      // Emit realtime event
      realtimeService.publishToRoom('post', comment.post.toString(), 'comment:updated', {
        id: comment._id.toString(),
        timestamp: new Date(),
        data: this.toSafeComment(comment),
      });
    }

    return comment;
  }

  async deleteComment(commentId: string): Promise<void> {
    // Get the comment to find its post
    const comment = await CommentModel.findById(commentId);
    if (!comment) {
      return;
    }

    const postId = comment.post;

    // Get all child comments (replies) before deleting
    const childComments = await CommentModel.find({ parentComment: commentId }).select('_id');
    const childCommentIds = childComments.map(c => c._id);

    // Calculate total comments to delete (parent + children)
    const totalCommentsToDelete = 1 + childCommentIds.length;

    // Delete the parent comment
    await CommentModel.findByIdAndDelete(commentId);

    // Delete all child comments (replies)
    await CommentModel.deleteMany({ parentComment: commentId });

    // Delete likes for the parent comment
    await LikeModel.deleteMany({ likeable: commentId, likeableType: 'Comment' });

    // Delete likes for all child comments (replies)
    if (childCommentIds.length > 0) {
      await LikeModel.deleteMany({
        likeable: { $in: childCommentIds },
        likeableType: 'Comment'
      });
    }

    // Decrement the post's comment count
    await PostModel.findByIdAndUpdate(postId, { $inc: { commentCount: -totalCommentsToDelete } });

    // Emit realtime event
    realtimeService.publishToRoom('post', postId.toString(), 'comment:deleted', {
      id: commentId,
      timestamp: new Date(),
      data: {
        commentId: commentId,
        childCommentIds: childCommentIds.map(id => id.toString()),
      },
    });
  }

  async getCommentCount(postId: string): Promise<number> {
    return CommentModel.countDocuments({ post: postId });
  }

  async getRepliesCount(commentId: string): Promise<number> {
    return CommentModel.countDocuments({ parentComment: commentId });
  }

  verifyCommentOwnership(comment: CommentDoc, userId: string): boolean {
    const authorId = typeof comment.author === 'object' && comment.author !== null && '_id' in comment.author
      ? (comment.author as any)._id.toString()
      : String(comment.author);
    return authorId === userId;
  }

  async canDeleteComment(comment: CommentDoc, userId: string): Promise<boolean> {
    // Check if user is the comment author
    if (this.verifyCommentOwnership(comment, userId)) {
      return true;
    }

    // Check if user is the post owner
    // First check if post is already populated with author field
    let postAuthorId: string | null = null;

    if (comment.post && typeof comment.post === 'object' && 'author' in comment.post) {
      // Post is already populated
      const post = comment.post as any;
      postAuthorId = typeof post.author === 'object' && post.author !== null && '_id' in post.author
        ? post.author._id.toString()
        : post.author.toString();
    } else {
      // Post is not populated, fetch it
      const post = await PostModel.findById(comment.post);
      if (post && post.author) {
        postAuthorId = typeof post.author === 'object' && post.author !== null && '_id' in post.author
          ? (post.author as any)._id.toString()
          : String(post.author);
      }
    }

    return postAuthorId === userId;
  }

  toSafeComment(comment: CommentDoc): SafeComment {
    const isAuthorPopulated = comment.author && typeof comment.author === 'object' && 'username' in comment.author;

    return {
      id: comment._id.toString(),
      postId: comment.post.toString(),
      authorId: isAuthorPopulated ? (comment.author as any)._id.toString() : comment.author.toString(),
      author: isAuthorPopulated ? {
        name: (comment.author as any).name,
        username: (comment.author as any).username,
        avatar: (comment.author as any).avatar,
      } : undefined,
      content: comment.content,
      parentCommentId: comment.parentComment ? comment.parentComment.toString() : null,
      likeCount: comment.likeCount || 0,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }

  broadcastTypingIndicator(postId: string, userId: string, name: string, userAvatar: string | undefined, isTyping: boolean, parentCommentId?: string): void {
    realtimeService.publishToRoom('post', postId, 'comment:typing', {
      id: userId,
      timestamp: new Date(),
      data: {
        userId,
        name,
        userAvatar,
        isTyping,
        parentCommentId,
      },
    });
  }
}

export const commentService = new CommentService();

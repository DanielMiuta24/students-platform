import { LikeModel, type LikeDoc } from '../models';
import type { CreateLikeDTO, LikeQueryDTO } from '../types';
import { LIKE_ERROR } from '../constants';
import { PostModel } from '../../post/models';
import { CommentModel } from '../../comment/models';
import { LikeBuilder } from '../builders';
import { notificationService } from '../../notification/services';

export class LikeService {
  async like(data: CreateLikeDTO): Promise<LikeDoc> {
    const entity = await this.getLikeableEntity(data);
    if (!entity) {
      throw new Error(LIKE_ERROR.POST_NOT_FOUND);
    }

    const query = new LikeBuilder()
      .fromDTO(data)
      .build();

    const existingLike = await LikeModel.findOne(query);

    if (existingLike) {
      throw new Error(LIKE_ERROR.ALREADY_LIKED);
    }

    const likeData = new LikeBuilder()
      .fromDTO(data)
      .build();

    const like = new LikeModel(likeData);
    await like.save();

    await this.incrementLikeCount(data);

    // Extract entity owner ID, handling both populated and unpopulated author
    let entityOwnerId: string | undefined;
    if (entity.author) {
      if (typeof entity.author === 'string') {
        entityOwnerId = entity.author;
      } else if (entity.author._id) {
        entityOwnerId = entity.author._id.toString();
      }
    }

    if (entityOwnerId && entityOwnerId !== data.userId) {
      // Check if notification should be sent based on post visibility
      let shouldNotify = false;

      if (data.likeableType === 'Post') {
        // For post likes, check post visibility
        const post = await PostModel.findById(data.likeableId).select('visibility community').populate('author', 'followers following');
        if (post) {
          shouldNotify = await this.shouldNotifyForPost(post, data.userId, entityOwnerId);
        }
      } else if (data.likeableType === 'Comment') {
        // For comment likes, get the parent post and check its visibility
        const comment = await CommentModel.findById(data.likeableId).select('post');
        if (comment) {
          const post = await PostModel.findById(comment.post).select('visibility community').populate('author', 'followers following');
          if (post) {
            shouldNotify = await this.shouldNotifyForPost(post, data.userId, entityOwnerId);
          }
        }
      }

      if (shouldNotify) {
        await notificationService.createNotification({
          recipientId: entityOwnerId,
          actorId: data.userId,
          type: 'like',
          targetModel: data.likeableType === 'Post' ? 'Post' : 'Comment',
          targetId: data.likeableId,
        }).catch(err => console.error('Failed to create like notification:', err));
      }
    }

    return like;
  }

  async unlike(data: LikeQueryDTO): Promise<void> {
    const query = new LikeBuilder()
      .fromDTO(data)
      .build();

    const like = await LikeModel.findOneAndDelete(query);

    if (!like) {
      throw new Error(LIKE_ERROR.LIKE_NOT_FOUND);
    }

    await this.decrementLikeCount(data);
  }

  async hasUserLiked(data: LikeQueryDTO): Promise<boolean> {
    const query = new LikeBuilder()
      .fromDTO(data)
      .build();

    const like = await LikeModel.findOne(query);

    return !!like;
  }

  async getLikesByEntity(data: LikeQueryDTO): Promise<LikeDoc[]> {
    const query = new LikeBuilder()
      .fromDTO(data)
      .build();

    return LikeModel.find(query)
      .populate('user', 'name username avatar')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getLikesByUser(data: LikeQueryDTO): Promise<LikeDoc[]> {
    const query = new LikeBuilder()
      .fromDTO(data)
      .build();

    return LikeModel.find(query)
      .sort({ createdAt: -1 })
      .exec();
  }

  private async getLikeableEntity(data: LikeQueryDTO): Promise<any> {
    switch (data.likeableType) {
      case 'Post':
        return PostModel.findById(data.likeableId);
      case 'Comment':
        return CommentModel.findById(data.likeableId);
      default:
        return null;
    }
  }

  private async incrementLikeCount(data: LikeQueryDTO): Promise<void> {
    switch (data.likeableType) {
      case 'Post':
        await PostModel.findByIdAndUpdate(data.likeableId, { $inc: { likeCount: 1 } });
        break;
      case 'Comment':
        await CommentModel.findByIdAndUpdate(data.likeableId, { $inc: { likeCount: 1 } });
        break;
    }
  }

  private async decrementLikeCount(data: LikeQueryDTO): Promise<void> {
    switch (data.likeableType) {
      case 'Post':
        await PostModel.findByIdAndUpdate(data.likeableId, { $inc: { likeCount: -1 } });
        break;
      case 'Comment':
        await CommentModel.findByIdAndUpdate(data.likeableId, { $inc: { likeCount: -1 } });
        break;
    }
  }

  async deleteLikesByPost(postId: string): Promise<void> {
    await LikeModel.deleteMany({ likeable: postId, likeableType: 'Post' });
  }

  private async shouldNotifyForPost(post: any, actorId: string, recipientId: string): Promise<boolean> {
    // Private posts: never notify
    if (post.visibility === 'private') {
      return false;
    }

    // Public posts: always notify
    if (post.visibility === 'public') {
      return true;
    }

    // Community posts: notify (actor already has access if they can like)
    if (post.visibility === 'community') {
      return true;
    }

    // Friends posts: only notify if actor and post author are mutual followers
    if (post.visibility === 'friends') {
      const postAuthor = post.author;
      if (postAuthor && postAuthor.followers && postAuthor.following) {
        const authorFollowers = postAuthor.followers.map((id: any) => id.toString());
        const authorFollowing = postAuthor.following.map((id: any) => id.toString());

        // Check if actor is a mutual follower
        return authorFollowers.includes(actorId) && authorFollowing.includes(actorId);
      }
      return false;
    }

    return false;
  }
}

export const likeService = new LikeService();

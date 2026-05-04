import { LikeModel, type LikeDoc } from '../models';
import type { CreateLikeDTO, LikeQueryDTO } from '../types';
import { LIKE_ERROR } from '../constants';
import { PostModel } from '../../post/models';
import { CommentModel } from '../../comment/models';
import { LikeBuilder } from '../builders';

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
}

export const likeService = new LikeService();

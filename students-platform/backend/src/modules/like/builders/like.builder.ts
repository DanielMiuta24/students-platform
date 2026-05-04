import type { LikeableType } from '../models';
import type { CreateLikeDTO, LikeQueryDTO } from '../types';

export class LikeBuilder {
  private data: any = {};

  setUser(userId?: string): this {
    this.data.user = userId;
    return this;
  }

  setLikeable(likeableId?: string): this {
    this.data.likeable = likeableId;
    return this;
  }

  setLikeableType(likeableType?: LikeableType): this {
    this.data.likeableType = likeableType;
    return this;
  }

  fromDTO(dto: CreateLikeDTO | LikeQueryDTO): this {
    return this
      .setUser(dto.userId)
      .setLikeable(dto.likeableId)
      .setLikeableType(dto.likeableType);
  }

  build(): any {
    return this.data;
  }
}

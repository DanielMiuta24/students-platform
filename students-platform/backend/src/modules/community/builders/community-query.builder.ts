import type { GetCommunitiesDTO } from '../types';

export class CommunityQueryBuilder {
  private query: any = { isActive: true };

  setCategory(categoryId: string): this {
    this.query.category = categoryId;
    return this;
  }

  setFounder(founderId: string): this {
    this.query.founder = founderId;
    return this;
  }

  setSearch(search: string): this {
    this.query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
    return this;
  }

  setCursor(cursor: string): this {
    this.query._id = { $lt: cursor };
    return this;
  }

  fromDTO(dto: GetCommunitiesDTO): this {
    if (dto.category) this.setCategory(dto.category);
    if (dto.founderId) this.setFounder(dto.founderId);
    if (dto.search) this.setSearch(dto.search);
    if (dto.cursor) this.setCursor(dto.cursor);
    return this;
  }

  build(): any {
    return this.query;
  }
}

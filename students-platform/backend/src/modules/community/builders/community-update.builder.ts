import type { UpdateCommunityDTO } from '../types';
import { COMMUNITY_VISIBILITY } from '../constants';

export class CommunityUpdateBuilder {
  private data: any = {};

  setName(name: string): this {
    this.data.name = name;
    return this;
  }

  setDescription(description: string): this {
    this.data.description = description;
    return this;
  }

  setRules(rules: string): this {
    this.data.rules = rules;
    return this;
  }

  setCategory(categoryId: string): this {
    this.data.category = categoryId;
    return this;
  }

  setCoverImage(coverImageId?: string): this {
    if (coverImageId !== undefined) {
      this.data.coverImage = coverImageId;
    }
    return this;
  }

  setRequiresApproval(requiresApproval: boolean): this {
    this.data.requiresApproval = requiresApproval;
    return this;
  }

  setAllowMemberPosts(allowMemberPosts: boolean): this {
    this.data.allowMemberPosts = allowMemberPosts;
    return this;
  }

  setAllowMemberInvites(allowMemberInvites: boolean): this {
    this.data.allowMemberInvites = allowMemberInvites;
    return this;
  }

  setVisibility(visibility: typeof COMMUNITY_VISIBILITY[keyof typeof COMMUNITY_VISIBILITY]): this {
    this.data.visibility = visibility;
    return this;
  }

  fromDTO(dto: UpdateCommunityDTO): this {
    if (dto.name !== undefined) this.setName(dto.name);
    if (dto.description !== undefined) this.setDescription(dto.description);
    if (dto.rules !== undefined) this.setRules(dto.rules);
    if (dto.category !== undefined) this.setCategory(dto.category);
    if (dto.coverImage !== undefined) this.setCoverImage(dto.coverImage);
    if (dto.visibility !== undefined) this.setVisibility(dto.visibility);
    if (dto.requiresApproval !== undefined) this.setRequiresApproval(dto.requiresApproval);
    if (dto.allowMemberPosts !== undefined) this.setAllowMemberPosts(dto.allowMemberPosts);
    if (dto.allowMemberInvites !== undefined) this.setAllowMemberInvites(dto.allowMemberInvites);
    return this;
  }

  build(): any {
    return this.data;
  }
}

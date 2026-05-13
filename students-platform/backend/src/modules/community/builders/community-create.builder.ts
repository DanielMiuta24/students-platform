import type { CreateCommunityDTO } from '../types';
import { toSlug } from '../../../shared/utils/slug';
import { COMMUNITY_ROLE, COMMUNITY_VISIBILITY } from '../constants';

export class CommunityCreateBuilder {
  private data: any = {
    isActive: true,
    visibility: COMMUNITY_VISIBILITY.PUBLIC,
    memberCount: 1,
    postCount: 0,
    members: [],
    requiresApproval: false,
    allowMemberPosts: true,
    allowMemberInvites: true,
  };

  setName(name: string): this {
    this.data.name = name;
    this.data.slug = toSlug(name);
    return this;
  }

  setDescription(description: string): this {
    this.data.description = description;
    return this;
  }

  setRules(rules?: string): this {
    if (rules) {
      this.data.rules = rules;
    }
    return this;
  }

  setCategory(categoryId: string): this {
    this.data.category = categoryId;
    return this;
  }

  setFounder(founderId: string): this {
    this.data.founder = founderId;
    this.data.members = [{
      user: founderId,
      role: COMMUNITY_ROLE.FOUNDER,
      joinedAt: new Date(),
    }];
    return this;
  }

  setCoverImage(coverImageId?: string): this {
    if (coverImageId) {
      this.data.coverImage = coverImageId;
    }
    return this;
  }

  setRequiresApproval(requiresApproval?: boolean): this {
    if (requiresApproval !== undefined) {
      this.data.requiresApproval = requiresApproval;
    }
    return this;
  }

  setVisibility(visibility?: typeof COMMUNITY_VISIBILITY[keyof typeof COMMUNITY_VISIBILITY]): this {
    if (visibility) {
      this.data.visibility = visibility;
    }
    return this;
  }

  fromDTO(dto: CreateCommunityDTO): this {
    return this
      .setName(dto.name)
      .setDescription(dto.description)
      .setRules(dto.rules)
      .setCategory(dto.category)
      .setFounder(dto.founderId)
      .setCoverImage(dto.coverImage)
      .setVisibility(dto.visibility)
      .setRequiresApproval(dto.requiresApproval);
  }

  build(): any {
    return this.data;
  }
}

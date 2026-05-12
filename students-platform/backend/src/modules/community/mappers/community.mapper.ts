import type { CommunityDoc } from '../models';
import type { SafeCommunity, SafeFounder, SafeCategory } from '../types';

export class CommunityMapper {
  static toSafeCommunity(community: CommunityDoc, userId?: string): SafeCommunity {
    let joined: boolean | undefined;
    let role: string | undefined;

    if (userId) {
      const member = community.members?.find((m: any) => m.user && (typeof m.user === 'string' ? m.user : m.user._id?.toString()) === userId);
      joined = !!member;
      role = member?.role;
    }

    return {
      id: community._id.toString(),
      name: community.name,
      slug: community.slug,
      description: community.description ?? undefined,
      rules: community.rules ?? undefined,
      category: this.mapCategory(community.category),
      coverImage: this.extractImageUrl(community.coverImage),
      founder: this.mapFounder(community.founder),
      memberCount: community.memberCount,
      postCount: community.postCount,
      isActive: community.isActive,
      visibility: community.visibility,
      requiresApproval: community.requiresApproval,
      allowMemberPosts: community.allowMemberPosts,
      allowMemberInvites: community.allowMemberInvites,
      joined,
      role,
      createdAt: community.createdAt,
      updatedAt: community.updatedAt,
    };
  }

  static toSafeCommunities(communities: CommunityDoc[], userId?: string): SafeCommunity[] {
    return communities.map(c => this.toSafeCommunity(c, userId));
  }

  private static mapFounder(founder: any): string | SafeFounder {
    if (!founder) return '';
    if (typeof founder === 'string') return founder;

    if (founder._id && founder.name) {
      return {
        id: founder._id.toString(),
        name: founder.name || '',
        username: founder.username || '',
        avatar: founder.avatar || undefined,
      };
    }

    return founder._id?.toString() || '';
  }

  private static mapCategory(category: any): string | SafeCategory {
    if (!category) return '';
    if (typeof category === 'string') return category;

    if (category._id && category.name) {
      return {
        id: category._id.toString(),
        name: category.name,
        slug: category.slug || '',
      };
    }

    return category._id?.toString() || '';
  }

  private static extractImageUrl(image: any): string | undefined {
    if (!image) return undefined;
    if (typeof image === 'string') return image;
    if (image.url) return image.url;
    return undefined;
  }
}

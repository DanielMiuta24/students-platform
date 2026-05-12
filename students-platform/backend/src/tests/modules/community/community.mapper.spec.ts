import { CommunityMapper } from '../../../modules/community/mappers';
import { COMMUNITY_ROLE } from '../../../modules/community/constants';

describe('CommunityMapper', () => {
  const mockCommunity = {
    _id: { toString: () => 'comm123' },
    name: 'Study Group',
    slug: 'study-group',
    description: 'A study community',
    rules: 'Be respectful',
    category: {
      _id: { toString: () => 'cat123' },
      name: 'Education',
      slug: 'education',
    },
    coverImage: { url: 'https://example.com/image.jpg' },
    founder: {
      _id: { toString: () => 'founder123' },
      name: 'John Doe',
      username: 'johndoe',
      avatar: 'https://example.com/avatar.jpg',
    },
    members: [
      {
        user: { _id: { toString: () => 'founder123' } },
        role: COMMUNITY_ROLE.FOUNDER,
        joinedAt: new Date(),
      },
      {
        user: { _id: { toString: () => 'user456' } },
        role: COMMUNITY_ROLE.MEMBER,
        joinedAt: new Date(),
      },
    ],
    memberCount: 2,
    postCount: 5,
    isActive: true,
    requiresApproval: false,
    allowMemberPosts: true,
    allowMemberInvites: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
  } as any;

  describe('toSafeCommunity', () => {
    it('should map community without user context', () => {
      const result = CommunityMapper.toSafeCommunity(mockCommunity);

      expect(result.id).toBe('comm123');
      expect(result.name).toBe('Study Group');
      expect(result.slug).toBe('study-group');
      expect(result.description).toBe('A study community');
      expect(result.joined).toBeUndefined();
      expect(result.role).toBeUndefined();
    });

    it('should include joined and role for authenticated user', () => {
      const result = CommunityMapper.toSafeCommunity(mockCommunity, 'user456');

      expect(result.joined).toBe(true);
      expect(result.role).toBe(COMMUNITY_ROLE.MEMBER);
    });

    it('should show not joined for non-member', () => {
      const result = CommunityMapper.toSafeCommunity(mockCommunity, 'nonmember');

      expect(result.joined).toBe(false);
      expect(result.role).toBeUndefined();
    });

    it('should map populated category', () => {
      const result = CommunityMapper.toSafeCommunity(mockCommunity);

      expect(result.category).toEqual({
        id: 'cat123',
        name: 'Education',
        slug: 'education',
      });
    });

    it('should map category as string when not populated', () => {
      const communityWithCategoryId = {
        ...mockCommunity,
        category: 'cat123',
      };

      const result = CommunityMapper.toSafeCommunity(communityWithCategoryId as any);

      expect(result.category).toBe('cat123');
    });

    it('should map populated founder', () => {
      const result = CommunityMapper.toSafeCommunity(mockCommunity);

      expect(result.founder).toEqual({
        id: 'founder123',
        name: 'John Doe',
        username: 'johndoe',
        avatar: 'https://example.com/avatar.jpg',
      });
    });

    it('should extract cover image URL', () => {
      const result = CommunityMapper.toSafeCommunity(mockCommunity);

      expect(result.coverImage).toBe('https://example.com/image.jpg');
    });

    it('should handle missing cover image', () => {
      const communityWithoutImage = {
        ...mockCommunity,
        coverImage: null,
      };

      const result = CommunityMapper.toSafeCommunity(communityWithoutImage as any);

      expect(result.coverImage).toBeUndefined();
    });

    it('should include all settings', () => {
      const result = CommunityMapper.toSafeCommunity(mockCommunity);

      expect(result.requiresApproval).toBe(false);
      expect(result.allowMemberPosts).toBe(true);
      expect(result.allowMemberInvites).toBe(true);
    });
  });

  describe('toSafeCommunities', () => {
    it('should map array of communities', () => {
      const communities = [mockCommunity, mockCommunity];
      const result = CommunityMapper.toSafeCommunities(communities, 'user456');

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('comm123');
      expect(result[0].joined).toBe(true);
    });

    it('should handle empty array', () => {
      const result = CommunityMapper.toSafeCommunities([]);

      expect(result).toHaveLength(0);
    });
  });
});

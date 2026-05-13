import { CommunityCreateBuilder, CommunityUpdateBuilder, CommunityQueryBuilder } from '../../../modules/community/builders';
import { COMMUNITY_ROLE } from '../../../modules/community/constants';

describe('Community Builders', () => {
  describe('CommunityCreateBuilder', () => {
    it('should build community with all fields', () => {
      const dto = {
        name: 'Study Group',
        description: 'A study community',
        rules: 'Be respectful',
        category: 'cat123',
        founderId: 'founder123',
        coverImage: 'img123',
        requiresApproval: true,
      };

      const result = new CommunityCreateBuilder().fromDTO(dto).build();

      expect(result.name).toBe('Study Group');
      expect(result.slug).toBe('study-group');
      expect(result.description).toBe('A study community');
      expect(result.rules).toBe('Be respectful');
      expect(result.category).toBe('cat123');
      expect(result.founder).toBe('founder123');
      expect(result.coverImage).toBe('img123');
      expect(result.requiresApproval).toBe(true);
    });

    it('should set default values', () => {
      const dto = {
        name: 'Study Group',
        description: 'A study community',
        category: 'cat123',
        founderId: 'founder123',
      };

      const result = new CommunityCreateBuilder().fromDTO(dto).build();

      expect(result.isActive).toBe(true);
      expect(result.memberCount).toBe(1);
      expect(result.postCount).toBe(0);
      expect(result.requiresApproval).toBe(false);
      expect(result.allowMemberPosts).toBe(true);
      expect(result.allowMemberInvites).toBe(true);
    });

    it('should create founder member with correct role', () => {
      const dto = {
        name: 'Study Group',
        description: 'A study community',
        category: 'cat123',
        founderId: 'founder123',
      };

      const result = new CommunityCreateBuilder().fromDTO(dto).build();

      expect(result.members).toHaveLength(1);
      expect(result.members[0].user).toBe('founder123');
      expect(result.members[0].role).toBe(COMMUNITY_ROLE.FOUNDER);
      expect(result.members[0].joinedAt).toBeInstanceOf(Date);
    });

    it('should generate slug from name', () => {
      const result = new CommunityCreateBuilder()
        .setName('Study Group 2024!')
        .build();

      expect(result.slug).toBe('study-group-2024');
    });

    it('should handle optional fields', () => {
      const dto = {
        name: 'Study Group',
        description: 'A study community',
        category: 'cat123',
        founderId: 'founder123',
      };

      const result = new CommunityCreateBuilder().fromDTO(dto).build();

      expect(result.rules).toBeUndefined();
      expect(result.coverImage).toBeUndefined();
    });
  });

  describe('CommunityUpdateBuilder', () => {
    it('should build update with all fields', () => {
      const dto = {
        name: 'Updated Name',
        description: 'Updated description',
        rules: 'Updated rules',
        category: 'cat456',
        coverImage: 'img456',
        requiresApproval: true,
        allowMemberPosts: false,
        allowMemberInvites: false,
      };

      const result = new CommunityUpdateBuilder().fromDTO(dto).build();

      expect(result.name).toBe('Updated Name');
      expect(result.description).toBe('Updated description');
      expect(result.rules).toBe('Updated rules');
      expect(result.category).toBe('cat456');
      expect(result.coverImage).toBe('img456');
      expect(result.requiresApproval).toBe(true);
      expect(result.allowMemberPosts).toBe(false);
      expect(result.allowMemberInvites).toBe(false);
    });

    it('should only include provided fields', () => {
      const dto = {
        description: 'Updated description',
      };

      const result = new CommunityUpdateBuilder().fromDTO(dto).build();

      expect(result.description).toBe('Updated description');
      expect(result.name).toBeUndefined();
      expect(result.category).toBeUndefined();
    });

    it('should handle boolean false values', () => {
      const dto = {
        requiresApproval: false,
        allowMemberPosts: false,
        allowMemberInvites: false,
      };

      const result = new CommunityUpdateBuilder().fromDTO(dto).build();

      expect(result.requiresApproval).toBe(false);
      expect(result.allowMemberPosts).toBe(false);
      expect(result.allowMemberInvites).toBe(false);
    });

    it('should handle empty DTO', () => {
      const result = new CommunityUpdateBuilder().fromDTO({}).build();

      expect(Object.keys(result)).toHaveLength(0);
    });
  });

  describe('CommunityQueryBuilder', () => {
    it('should build query with all filters', () => {
      const dto = {
        category: 'cat123',
        founderId: 'founder123',
        search: 'study',
        cursor: 'comm123',
      };

      const result = new CommunityQueryBuilder().fromDTO(dto).build();

      expect(result.isActive).toBe(true);
      expect(result.category).toBe('cat123');
      expect(result.founder).toBe('founder123');
      expect(result.$or).toEqual([
        { name: { $regex: 'study', $options: 'i' } },
        { description: { $regex: 'study', $options: 'i' } },
      ]);
      expect(result._id).toEqual({ $lt: 'comm123' });
    });

    it('should set default isActive filter', () => {
      const result = new CommunityQueryBuilder().fromDTO({}).build();

      expect(result.isActive).toBe(true);
    });

    it('should handle partial filters', () => {
      const dto = {
        category: 'cat123',
      };

      const result = new CommunityQueryBuilder().fromDTO(dto).build();

      expect(result.category).toBe('cat123');
      expect(result.founder).toBeUndefined();
      expect(result.$or).toBeUndefined();
    });

    it('should create search filter with case insensitive regex', () => {
      const result = new CommunityQueryBuilder()
        .setSearch('Study Group')
        .build();

      expect(result.$or[0].name.$options).toBe('i');
      expect(result.$or[1].description.$options).toBe('i');
    });

    it('should handle cursor for pagination', () => {
      const result = new CommunityQueryBuilder()
        .setCursor('comm456')
        .build();

      expect(result._id).toEqual({ $lt: 'comm456' });
    });
  });
});

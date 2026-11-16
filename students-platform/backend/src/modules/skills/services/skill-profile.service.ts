import { SkillProfileModel, type SkillProfileDoc } from '../models/skill-profile.model';
import type {
  SkillProfileDTO,
  SkillEntry,
  LanguageEntry,
  SearchProfilesParams,
} from '../types/skill.types';

export class SkillProfileService {
  async getOrCreate(userId: string): Promise<SkillProfileDoc> {
    const existing = await SkillProfileModel.findOne({ userId });
    if (existing) {
      return existing;
    }
    const profile = new SkillProfileModel({ userId });
    return profile.save();
  }

  async updateProfile(userId: string, dto: SkillProfileDTO): Promise<SkillProfileDoc> {
    const profile = await SkillProfileModel.findOneAndUpdate(
      { userId },
      { $set: dto },
      { new: true, upsert: true, runValidators: true }
    );
    return profile!;
  }

  async addSkill(userId: string, skill: SkillEntry): Promise<SkillProfileDoc> {
    const profile = await SkillProfileModel.findOneAndUpdate(
      { userId },
      { $push: { skills: skill } },
      { new: true, upsert: true }
    );
    return profile!;
  }

  async removeSkill(userId: string, skillName: string): Promise<SkillProfileDoc> {
    const profile = await SkillProfileModel.findOneAndUpdate(
      { userId },
      { $pull: { skills: { name: skillName } } },
      { new: true }
    );
    if (!profile) {
      throw new Error('SKILL_PROFILE_NOT_FOUND');
    }
    return profile;
  }

  async addLanguage(userId: string, lang: LanguageEntry): Promise<SkillProfileDoc> {
    const profile = await SkillProfileModel.findOneAndUpdate(
      { userId },
      { $push: { languages: lang } },
      { new: true, upsert: true }
    );
    return profile!;
  }

  async removeLanguage(userId: string, language: string): Promise<SkillProfileDoc> {
    const profile = await SkillProfileModel.findOneAndUpdate(
      { userId },
      { $pull: { languages: { language } } },
      { new: true }
    );
    if (!profile) {
      throw new Error('SKILL_PROFILE_NOT_FOUND');
    }
    return profile;
  }

  async getPublicProfile(userId: string): Promise<SkillProfileDoc | null> {
    const profile = await SkillProfileModel.findOne({ userId, isPublic: true });
    return profile;
  }

  async searchProfiles(params: SearchProfilesParams): Promise<{
    profiles: SkillProfileDoc[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { skill, language, page = 1, limit = 20 } = params;
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(100, Math.max(1, limit));
    const skip = (safePage - 1) * safeLimit;

    const query: Record<string, unknown> = { isPublic: true };

    if (skill) {
      query['skills.name'] = { $regex: skill, $options: 'i' };
    }

    if (language) {
      query['languages.language'] = { $regex: language, $options: 'i' };
    }

    const [profiles, total] = await Promise.all([
      SkillProfileModel.find(query)
        .populate('userId', 'name username avatar')
        .skip(skip)
        .limit(safeLimit)
        .exec(),
      SkillProfileModel.countDocuments(query),
    ]);

    return { profiles, total, page: safePage, limit: safeLimit };
  }
}

export const skillProfileService = new SkillProfileService();

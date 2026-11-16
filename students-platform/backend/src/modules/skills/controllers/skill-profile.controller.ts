import type { Request, Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../../../shared/middleware/auth.middleware';
import { skillProfileService } from '../services/skill-profile.service';

class SkillProfileController {
  private static readonly HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NOT_FOUND: 404,
    FORBIDDEN: 403,
  } as const;

  private handleError(err: unknown, res: Response, next: NextFunction): Response | void {
    if (!(err instanceof Error)) {
      return next(err);
    }

    if (err.message === 'SKILL_PROFILE_NOT_FOUND') {
      return res.status(404).json({ message: 'Skill profile not found' });
    }

    return next(err);
  }

  getMyProfile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const profile = await skillProfileService.getOrCreate(req.user!.id);
      return res.status(SkillProfileController.HTTP_STATUS.OK).json({ profile });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  updateMyProfile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const profile = await skillProfileService.updateProfile(req.user!.id, req.body);
      return res.status(SkillProfileController.HTTP_STATUS.OK).json({
        message: 'Profile updated successfully',
        profile,
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  addSkill = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const profile = await skillProfileService.addSkill(req.user!.id, req.body);
      return res.status(SkillProfileController.HTTP_STATUS.CREATED).json({
        message: 'Skill added successfully',
        profile,
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  removeSkill = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { skillName } = req.params;
      const profile = await skillProfileService.removeSkill(req.user!.id, skillName);
      return res.status(SkillProfileController.HTTP_STATUS.OK).json({
        message: 'Skill removed successfully',
        profile,
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  addLanguage = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const profile = await skillProfileService.addLanguage(req.user!.id, req.body);
      return res.status(SkillProfileController.HTTP_STATUS.CREATED).json({
        message: 'Language added successfully',
        profile,
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  removeLanguage = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { language } = req.params;
      const profile = await skillProfileService.removeLanguage(req.user!.id, language);
      return res.status(SkillProfileController.HTTP_STATUS.OK).json({
        message: 'Language removed successfully',
        profile,
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  searchProfiles = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {
        skill,
        language,
        page,
        limit,
      } = req.query as Record<string, string>;

      const result = await skillProfileService.searchProfiles({
        skill,
        language,
        page: page ? parseInt(page, 10) : undefined,
        limit: limit ? parseInt(limit, 10) : undefined,
      });

      return res.status(SkillProfileController.HTTP_STATUS.OK).json(result);
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  getPublicProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req.params;
      const profile = await skillProfileService.getPublicProfile(userId);

      if (!profile) {
        return res.status(SkillProfileController.HTTP_STATUS.NOT_FOUND).json({
          message: 'Profile not found or not public',
        });
      }

      return res.status(SkillProfileController.HTTP_STATUS.OK).json({ profile });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };
}

export const skillProfileController = new SkillProfileController();

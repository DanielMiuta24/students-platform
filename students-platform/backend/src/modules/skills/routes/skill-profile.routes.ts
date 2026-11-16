import { Router } from 'express';
import { skillProfileController } from '../controllers/skill-profile.controller';
import { authMiddleware } from '../../../shared/middleware/auth.middleware';

const router = Router();

// Authenticated routes
router.get('/me', authMiddleware, skillProfileController.getMyProfile);
router.put('/me', authMiddleware, skillProfileController.updateMyProfile);
router.post('/me/skills', authMiddleware, skillProfileController.addSkill);
router.delete('/me/skills/:skillName', authMiddleware, skillProfileController.removeSkill);
router.post('/me/languages', authMiddleware, skillProfileController.addLanguage);
router.delete('/me/languages/:language', authMiddleware, skillProfileController.removeLanguage);

// Public routes
router.get('/search', skillProfileController.searchProfiles);
router.get('/:userId', skillProfileController.getPublicProfile);

export default router;

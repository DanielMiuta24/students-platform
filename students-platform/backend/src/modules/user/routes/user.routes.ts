import { Router } from 'express';
import { userController } from '../controllers';
import { authMiddleware } from '../../../shared/middleware/auth.middleware';
import { validateRegister, validateLogin, validateChangePassword, validateUpdateProfile } from '../validators';
import { busboyUploadMiddleware } from '../../image/middleware';
import { IMAGE_VALIDATION } from '../../image/services';

const router = Router();

router.post('/register', validateRegister, userController.register);

router.post('/login', validateLogin, userController.login);

router.post('/logout', userController.logout);

router.get('/get-profile', authMiddleware, userController.getProfile);

router.get('/username/:username', userController.getUserByUsername);

router.put(
  '/change-password',
  authMiddleware,
  validateChangePassword,
  userController.changePassword
);

router.put(
  '/update-profile',
  authMiddleware,
  busboyUploadMiddleware({
    maxFiles: 1,
    maxFileSize: IMAGE_VALIDATION.MAX_FILE_SIZE,
    allowedMimeTypes: [...IMAGE_VALIDATION.ALLOWED_MIME_TYPES],
    filesRequired: false,
  }),
  validateUpdateProfile,
  userController.updateProfile
);

export default router;

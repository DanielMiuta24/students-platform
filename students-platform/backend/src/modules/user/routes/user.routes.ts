import { Router } from 'express';
import { userController } from '../controllers';
import { authMiddleware } from '../../../shared/middleware/auth.middleware';


const router = Router();
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/get-profile', authMiddleware, userController.getProfile);


export default router;

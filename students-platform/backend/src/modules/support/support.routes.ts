import { Router } from 'express';
import { supportController } from './support.controller';

const router = Router();
router.post('/', supportController.submitReport);
export default router;

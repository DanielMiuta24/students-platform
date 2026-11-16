import { Router } from 'express';
import { universityController } from '../controllers';

const router = Router();

router.get('/', universityController.search);
router.get('/domains', universityController.getDomains);

export default router;

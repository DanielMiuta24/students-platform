import { Router } from 'express';
import { universityController } from '../controllers';

const router = Router();

router.get('/', universityController.search);

export default router;

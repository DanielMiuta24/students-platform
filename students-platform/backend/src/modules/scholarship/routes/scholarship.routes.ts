import { Router } from 'express';
import { scholarshipController } from '../controllers';

const router = Router();

router.get('/', scholarshipController.fetchScholarships);
router.get('/global', scholarshipController.fetchGlobalScholarships);

export default router;
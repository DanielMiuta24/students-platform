import { Router } from 'express';
import { scholarshipController } from '../controllers';

const router = Router();

router.get('/', scholarshipController.fetchScholarships);

export default router;
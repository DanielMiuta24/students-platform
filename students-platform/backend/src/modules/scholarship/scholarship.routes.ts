import { Router } from 'express';
import { scholarshipController } from './scholarship.controller';

const router = Router();

router.get('/', scholarshipController.fetchScholarships);

export default router;
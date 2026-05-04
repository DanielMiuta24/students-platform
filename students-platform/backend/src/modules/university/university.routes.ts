import { Router } from 'express';
import { universityController } from './university.controller';

const router = Router();

router.get('/', universityController.search);

export default router;

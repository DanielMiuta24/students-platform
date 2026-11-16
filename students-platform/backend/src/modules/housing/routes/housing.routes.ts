import { Router } from 'express';
import { housingController } from '../controllers/housing.controller';
import { authMiddleware } from '../../../shared/middleware/auth.middleware';

const router = Router();

// Static authenticated routes must be declared before /:id to avoid shadowing
router.get('/saved', authMiddleware, housingController.getSavedListings);
router.get('/my-listings', authMiddleware, housingController.getMyListings);

// Public routes
router.get('/', housingController.searchListings);
router.get('/:id', housingController.getListingById);

// Authenticated routes
router.post('/', authMiddleware, housingController.createListing);
router.put('/:id', authMiddleware, housingController.updateListing);
router.delete('/:id', authMiddleware, housingController.deleteListing);
router.post('/:id/save', authMiddleware, housingController.saveListing);
router.delete('/:id/save', authMiddleware, housingController.unsaveListing);

export default router;

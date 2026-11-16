import type { Request, Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../../../shared/middleware/auth.middleware';
import { housingService } from '../services/housing.service';

class HousingController {
  private static readonly HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NOT_FOUND: 404,
    FORBIDDEN: 403,
  } as const;

  private handleError(err: unknown, res: Response, next: NextFunction): Response | void {
    if (!(err instanceof Error)) {
      return next(err);
    }

    if (err.message === 'HOUSING_NOT_FOUND') {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (err.message === 'HOUSING_UNAUTHORIZED') {
      return res.status(403).json({ message: 'You are not authorized to modify this listing' });
    }

    return next(err);
  }

  searchListings = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { country, city, type, status, maxPrice, availableFrom, page, limit } =
        req.query as Record<string, string>;

      const result = await housingService.searchListings({
        country,
        city,
        type: type as any,
        status: status as any,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        availableFrom: availableFrom ? new Date(availableFrom) : undefined,
        page: page ? parseInt(page, 10) : undefined,
        limit: limit ? parseInt(limit, 10) : undefined,
      });

      return res.status(HousingController.HTTP_STATUS.OK).json(result);
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  getSavedListings = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const listings = await housingService.getSaved(req.user!.id);
      return res.status(HousingController.HTTP_STATUS.OK).json({ listings });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  getMyListings = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const listings = await housingService.getMyListings(req.user!.id);
      return res.status(HousingController.HTTP_STATUS.OK).json({ listings });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  getListingById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const listing = await housingService.getById(id);

      if (!listing) {
        return res.status(HousingController.HTTP_STATUS.NOT_FOUND).json({
          message: 'Listing not found',
        });
      }

      return res.status(HousingController.HTTP_STATUS.OK).json({ listing });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  createListing = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const listing = await housingService.createListing(req.user!.id, req.body);
      return res.status(HousingController.HTTP_STATUS.CREATED).json({
        message: 'Listing created successfully',
        listing,
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  updateListing = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const listing = await housingService.updateListing(id, req.user!.id, req.body);
      return res.status(HousingController.HTTP_STATUS.OK).json({
        message: 'Listing updated successfully',
        listing,
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  deleteListing = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      await housingService.deleteListing(id, req.user!.id);
      return res.status(HousingController.HTTP_STATUS.OK).json({
        message: 'Listing deleted successfully',
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  saveListing = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const listing = await housingService.saveListing(id, req.user!.id);
      return res.status(HousingController.HTTP_STATUS.OK).json({
        message: 'Listing saved',
        listing,
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  unsaveListing = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const listing = await housingService.unsaveListing(id, req.user!.id);
      return res.status(HousingController.HTTP_STATUS.OK).json({
        message: 'Listing unsaved',
        listing,
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };
}

export const housingController = new HousingController();

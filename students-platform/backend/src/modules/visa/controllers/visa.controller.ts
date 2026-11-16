import type { Request, Response, NextFunction } from 'express';
import { visaService } from '../services';
import type { AuthenticatedRequest } from '../../../shared/middleware/auth.middleware';
import { VisaType, ProcessingTime } from '../types/visa.types';

class VisaController {
    searchGuides = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { country, visaType, search, page, limit } = req.query;

            const result = await visaService.searchGuides({
                country: country as string | undefined,
                visaType: visaType as VisaType | undefined,
                search: search as string | undefined,
                page: page ? Number(page) : undefined,
                limit: limit ? Number(limit) : undefined,
            });

            return res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    };

    getGuide = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const guide = await visaService.getById(id);

            if (!guide) {
                return res.status(404).json({ message: 'Visa guide not found' });
            }

            return res.status(200).json(guide);
        } catch (err) {
            next(err);
        }
    };

    getByCountry = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { country } = req.params;

            if (!country) {
                return res.status(400).json({ message: 'Country parameter is required' });
            }

            const guides = await visaService.getByCountry(country);
            return res.status(200).json(guides);
        } catch (err) {
            next(err);
        }
    };

    createGuide = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const { country, visaType, title } = req.body;

            if (!country || !visaType || !title) {
                return res
                    .status(400)
                    .json({ message: 'country, visaType, and title are required' });
            }

            if (!Object.values(VisaType).includes(visaType)) {
                return res.status(400).json({
                    message: `visaType must be one of: ${Object.values(VisaType).join(', ')}`,
                });
            }

            if (req.body.processingTime && !Object.values(ProcessingTime).includes(req.body.processingTime)) {
                return res.status(400).json({
                    message: `processingTime must be one of: ${Object.values(ProcessingTime).join(', ')}`,
                });
            }

            const guide = await visaService.createGuide(userId, req.body);
            return res.status(201).json(guide);
        } catch (err) {
            next(err);
        }
    };

    updateGuide = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const { id } = req.params;

            if (req.body.visaType && !Object.values(VisaType).includes(req.body.visaType)) {
                return res.status(400).json({
                    message: `visaType must be one of: ${Object.values(VisaType).join(', ')}`,
                });
            }

            if (req.body.processingTime && !Object.values(ProcessingTime).includes(req.body.processingTime)) {
                return res.status(400).json({
                    message: `processingTime must be one of: ${Object.values(ProcessingTime).join(', ')}`,
                });
            }

            const guide = await visaService.updateGuide(id, userId, req.body);

            if (!guide) {
                return res.status(404).json({ message: 'Visa guide not found' });
            }

            return res.status(200).json(guide);
        } catch (err) {
            next(err);
        }
    };

    deleteGuide = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const { id } = req.params;
            const deleted = await visaService.deleteGuide(id);

            if (!deleted) {
                return res.status(404).json({ message: 'Visa guide not found' });
            }

            return res.status(200).json({ message: 'Visa guide deleted successfully' });
        } catch (err) {
            next(err);
        }
    };
}

export const visaController = new VisaController();

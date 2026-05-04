import type { Request, Response, NextFunction } from 'express';
import { ScholarshipService } from '../services';
import { validateSearchParams } from '../validators';

class ScholarshipController {
    private scholarshipService: ScholarshipService;

    constructor() {
        this.scholarshipService = new ScholarshipService();
    }

    fetchScholarships = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = req.query.q as string;
            const location = req.query.location as string;

            if (!validateSearchParams(query, location)) {
                return res.status(400).json({ error: 'Query parameter is required' });
            }

            const scholarships = await this.scholarshipService.getScholarships(
                query,
                location || '0'
            );
            return res.status(200).json(scholarships);
        } catch (err) {
            if (err instanceof Error) {
                if (err.message === 'Request to scholarship API timed out') {
                    return res.status(504).json({ error: 'The scholarship service is currently unavailable. Please try again later.' });
                }
                if (err.message === 'Invalid API credentials') {
                    return res.status(401).json({ error: 'Authentication failed with scholarship service' });
                }
                if (err.message === 'Invalid request parameters') {
                    return res.status(400).json({ error: 'Invalid search parameters' });
                }
                if (err.message === 'Failed to fetch scholarships') {
                    return res.status(502).json({ error: 'Failed to fetch scholarships from external service' });
                }
            }
            next(err);
        }
    };
}

export const scholarshipController = new ScholarshipController();
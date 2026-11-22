import type { Request, Response, NextFunction } from 'express';
import { ScholarshipService } from '../services';
import { validateSearchParams } from '../validators';
import { globalScholarshipService } from '../services/global-scholarship.service';
import { searchDAAD } from '../daad.service';
import { parsePage } from '../validators/scholarship.validation';

class ScholarshipController {
    private scholarshipService: ScholarshipService;

    constructor() {
        this.scholarshipService = new ScholarshipService();
    }

    fetchScholarships = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = req.query.q as string;
            const location = req.query.location as string;
            const source = (req.query.source as string) || 'all';
            const page = parsePage(req.query.page as string);
            const subjectGroup = req.query.subjectGroup as string | undefined;
            const intention = req.query.intention as string | undefined;
            const originId = req.query.originId ? parseInt(req.query.originId as string, 10) : undefined;
            const nationality = req.query.nationality as string | undefined;

            if (!validateSearchParams(query, location)) {
                return res.status(400).json({ error: 'Query parameter is required' });
            }

            if (source === 'daad') {
                const result = await searchDAAD(query, subjectGroup, intention, page, 10, originId, nationality);
                return res.status(200).json(result);
            }

            if (source === 'careeronestop') {
                const result = await this.scholarshipService.getScholarships(query, location || '0');
                return res.status(200).json({ ...result, source: 'careeronestop' });
            }

            // source === 'all': run both in parallel
            const [daadResult, cosResult] = await Promise.allSettled([
                searchDAAD(query, subjectGroup, intention, page, 10),
                this.scholarshipService.getScholarships(query, location || '0'),
            ]);

            return res.status(200).json({
                daad: daadResult.status === 'fulfilled'
                    ? daadResult.value
                    : { scholarships: [], total: 0, source: 'daad', error: 'DAAD unavailable' },
                careeronestop: cosResult.status === 'fulfilled'
                    ? { ...cosResult.value, source: 'careeronestop' }
                    : { scholarships: [], total: 0, source: 'careeronestop', error: 'CareerOneStop unavailable' },
            });
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

    fetchGlobalScholarships = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { country, region, level, search, page, limit } = req.query;

            const result = await globalScholarshipService.searchGlobal({
                country: country as string | undefined,
                region: region as string | undefined,
                level: level as string | undefined,
                search: search as string | undefined,
                page: page ? Number(page) : undefined,
                limit: limit ? Number(limit) : undefined,
            });

            return res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    };
}

export const scholarshipController = new ScholarshipController();

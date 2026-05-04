import type { Request, Response, NextFunction } from 'express';
import { universityService } from '../services';

class UniversityController {
  search = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const name = (req.query.name as string | undefined)?.trim();
      const country = (req.query.country as string | undefined)?.trim();
      const page = req.query.page as string | undefined;

      const result = await universityService.searchUniversities({
        name,
        country,
        page,
      });

      return res.status(200).json(result);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === 'Failed to fetch universities from external API') {
          return res.status(502).json({ message: err.message });
        }
        if (err.message === 'At least one search parameter (name or country) is required') {
          return res.status(400).json({
            message: 'Please provide at least a "name" or a "country" parameter.',
          });
        }
      }
      next(err);
    }
  };
}

export const universityController = new UniversityController();

import type { Request, Response, NextFunction } from 'express';
import { supportService } from './support.service';

class SupportController {
  submitReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { problemType, subject, description, email, priority } = req.body;

      if (!problemType || !subject || !description || !email || !priority) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      await supportService.submitReport({ problemType, subject, description, email, priority });

      return res.status(200).json({ success: true, message: 'Report submitted successfully' });
    } catch (err) {
      return next(err);
    }
  };
}

export const supportController = new SupportController();

import type { Request, Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../../shared/middleware/auth.middleware';
import { TrackerEntry, type ApplicationStatus } from './tracker.model';

const VALID_STATUSES: ApplicationStatus[] = ['interested', 'applied', 'waiting', 'accepted', 'rejected'];

export const trackerController = {
  list: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const entries = await TrackerEntry.find({ userId: req.user!.id }).sort({ createdAt: -1 });
      return res.status(200).json(entries);
    } catch (err) { next(err); }
  },

  create: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { universityName, country, programme, status, notes, deadline } = req.body;
      if (!universityName?.trim()) return res.status(400).json({ message: 'University name is required' });
      const entry = await TrackerEntry.create({
        userId: req.user!.id,
        universityName: universityName.trim(),
        country: country?.trim() || '',
        programme: programme?.trim() || '',
        status: VALID_STATUSES.includes(status) ? status : 'interested',
        notes: notes?.trim() || '',
        deadline: deadline ? new Date(deadline) : undefined,
      });
      return res.status(201).json(entry);
    } catch (err) { next(err); }
  },

  update: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const entry = await TrackerEntry.findOne({ _id: req.params.id, userId: req.user!.id });
      if (!entry) return res.status(404).json({ message: 'Entry not found' });
      const { universityName, country, programme, status, notes, deadline } = req.body;
      if (universityName !== undefined) entry.universityName = universityName.trim();
      if (country !== undefined) entry.country = country.trim();
      if (programme !== undefined) entry.programme = programme.trim();
      if (status !== undefined && VALID_STATUSES.includes(status)) entry.status = status;
      if (notes !== undefined) entry.notes = notes.trim();
      if (deadline !== undefined) entry.deadline = deadline ? new Date(deadline) : undefined;
      await entry.save();
      return res.status(200).json(entry);
    } catch (err) { next(err); }
  },

  remove: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const entry = await TrackerEntry.findOneAndDelete({ _id: req.params.id, userId: req.user!.id });
      if (!entry) return res.status(404).json({ message: 'Entry not found' });
      return res.status(200).json({ message: 'Deleted' });
    } catch (err) { next(err); }
  },
};

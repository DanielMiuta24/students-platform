import type { Request, Response, NextFunction } from 'express';

const EVENT_CATEGORIES = [
  'career_fair',
  'open_day',
  'visa_workshop',
  'networking',
  'cultural',
  'other',
] as const;

const EVENT_STATUSES = ['upcoming', 'ongoing', 'past', 'cancelled'] as const;

export function validateCreateEvent(
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  const { title, description, date, location, country, city, category } = req.body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ message: 'title is required' });
  }

  if (!description || typeof description !== 'string' || !description.trim()) {
    return res.status(400).json({ message: 'description is required' });
  }

  if (!date) {
    return res.status(400).json({ message: 'date is required' });
  }

  if (isNaN(new Date(date).getTime())) {
    return res.status(400).json({ message: 'date must be a valid date' });
  }

  if (!location || typeof location !== 'string' || !location.trim()) {
    return res.status(400).json({ message: 'location is required' });
  }

  if (!country || typeof country !== 'string' || !country.trim()) {
    return res.status(400).json({ message: 'country is required' });
  }

  if (!city || typeof city !== 'string' || !city.trim()) {
    return res.status(400).json({ message: 'city is required' });
  }

  if (!category || !(EVENT_CATEGORIES as readonly string[]).includes(category)) {
    return res.status(400).json({
      message: `category must be one of: ${EVENT_CATEGORIES.join(', ')}`,
    });
  }

  if (req.body.status && !(EVENT_STATUSES as readonly string[]).includes(req.body.status)) {
    return res.status(400).json({
      message: `status must be one of: ${EVENT_STATUSES.join(', ')}`,
    });
  }

  return next();
}

export function validateUpdateEvent(
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  if (req.body.date && isNaN(new Date(req.body.date).getTime())) {
    return res.status(400).json({ message: 'date must be a valid date' });
  }

  if (req.body.endDate && isNaN(new Date(req.body.endDate).getTime())) {
    return res.status(400).json({ message: 'endDate must be a valid date' });
  }

  if (req.body.category && !(EVENT_CATEGORIES as readonly string[]).includes(req.body.category)) {
    return res.status(400).json({
      message: `category must be one of: ${EVENT_CATEGORIES.join(', ')}`,
    });
  }

  if (req.body.status && !(EVENT_STATUSES as readonly string[]).includes(req.body.status)) {
    return res.status(400).json({
      message: `status must be one of: ${EVENT_STATUSES.join(', ')}`,
    });
  }

  return next();
}

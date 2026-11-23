import { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../../shared/middleware/auth.middleware';
import { Video } from './video.model';

const extractVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

export const videoController = {
  list: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { category, country } = req.query;
      const filter: any = { approved: true };
      if (category) filter.category = category;
      if (country) filter.country = { $regex: country as string, $options: 'i' };
      const videos = await Video.find(filter)
        .sort({ createdAt: -1 })
        .populate('submittedBy', 'name username avatar');
      return res.json(videos);
    } catch (err) { return next(err); }
  },

  submit: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { title, youtubeUrl, category, country, description } = req.body;
      if (!title?.trim()) return res.status(400).json({ message: 'Title is required' });
      if (!youtubeUrl?.trim()) return res.status(400).json({ message: 'YouTube URL is required' });
      const videoId = extractVideoId(youtubeUrl);
      if (!videoId) return res.status(400).json({ message: 'Invalid YouTube URL' });
      const video = await Video.create({
        title: title.trim(),
        youtubeUrl: youtubeUrl.trim(),
        videoId,
        category: category || 'other',
        country: country?.trim() || '',
        description: description?.trim() || '',
        submittedBy: req.user!.id,
        approved: true,
      });
      return res.status(201).json(video);
    } catch (err) { return next(err); }
  },

  approve: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const video = await Video.findByIdAndUpdate(
        req.params.id,
        { approved: true },
        { new: true }
      );
      if (!video) return res.status(404).json({ message: 'Video not found' });
      return res.json(video);
    } catch (err) { return next(err); }
  },

  remove: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      await Video.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Deleted' });
    } catch (err) { return next(err); }
  },

  pending: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const videos = await Video.find({ approved: false })
        .sort({ createdAt: -1 })
        .populate('submittedBy', 'name username');
      return res.json(videos);
    } catch (err) { return next(err); }
  },
};

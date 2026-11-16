import type { Request, Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../../../shared/middleware/auth.middleware';
import { eventService } from '../services/event.service';
import type { EventSearchParams } from '../types/event.types';

class EventController {
  private static readonly HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
  } as const;

  private static readonly ERROR_RESPONSES: Record<string, { status: number; message: string }> = {
    EVENT_NOT_FOUND: { status: 404, message: 'Event not found' },
    EVENT_UNAUTHORIZED: { status: 403, message: 'You are not authorized to modify this event' },
    ALREADY_ATTENDING: { status: 409, message: 'You are already attending this event' },
    EVENT_FULL: { status: 409, message: 'This event has reached maximum capacity' },
    EVENT_CANCELLED: { status: 400, message: 'Cannot attend a cancelled event' },
    EVENT_PAST: { status: 400, message: 'Cannot attend a past event' },
  };

  private handleError(err: unknown, res: Response, next: NextFunction): Response | void {
    if (!(err instanceof Error)) {
      return next(err);
    }

    const errorResponse = EventController.ERROR_RESPONSES[err.message];

    if (errorResponse) {
      return res.status(errorResponse.status).json({ message: errorResponse.message });
    }

    return next(err);
  }

  searchEvents = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const params: EventSearchParams = {
        country: req.query.country as string | undefined,
        city: req.query.city as string | undefined,
        category: req.query.category as EventSearchParams['category'],
        status: req.query.status as EventSearchParams['status'],
        dateFrom: req.query.dateFrom as string | undefined,
        dateTo: req.query.dateTo as string | undefined,
        search: req.query.search as string | undefined,
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 20,
      };

      const result = await eventService.searchEvents(params);
      return res.status(EventController.HTTP_STATUS.OK).json(result);
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  getUpcoming = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const events = await eventService.getUpcoming(limit);
      return res.status(EventController.HTTP_STATUS.OK).json({ events });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  getById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const event = await eventService.getById(req.params.id);

      if (!event) {
        return res.status(EventController.HTTP_STATUS.NOT_FOUND).json({ message: 'Event not found' });
      }

      return res.status(EventController.HTTP_STATUS.OK).json({ event });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  createEvent = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const event = await eventService.createEvent(req.user!.id, req.body);
      return res.status(EventController.HTTP_STATUS.CREATED).json({
        message: 'Event created successfully',
        event,
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  updateEvent = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const event = await eventService.updateEvent(req.params.id, req.user!.id, req.body);
      return res.status(EventController.HTTP_STATUS.OK).json({
        message: 'Event updated successfully',
        event,
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  deleteEvent = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await eventService.deleteEvent(req.params.id, req.user!.id);
      return res.status(EventController.HTTP_STATUS.OK).json({ message: 'Event deleted successfully' });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  attendEvent = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const event = await eventService.attendEvent(req.params.id, req.user!.id);
      return res.status(EventController.HTTP_STATUS.OK).json({
        message: 'Successfully registered for event',
        event,
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  unattendEvent = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const event = await eventService.unattendEvent(req.params.id, req.user!.id);
      return res.status(EventController.HTTP_STATUS.OK).json({
        message: 'Successfully unregistered from event',
        event,
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };
}

export const eventController = new EventController();

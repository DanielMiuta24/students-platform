import { EventModel, type EventDoc } from '../models/event.model';
import type {
  CreateEventDTO,
  UpdateEventDTO,
  EventSearchParams,
  EventSearchResult,
  EventDTO,
} from '../types/event.types';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

function toEventDTO(doc: EventDoc): EventDTO {
  const obj = doc.toObject({ virtuals: false });
  const organizer = obj.organizer;

  return {
    id: doc._id.toString(),
    title: obj.title,
    description: obj.description,
    organizer:
      organizer && typeof organizer === 'object' && '_id' in organizer
        ? {
            id: (organizer as any)._id.toString(),
            name: (organizer as any).name,
            username: (organizer as any).username,
            avatar: (organizer as any).avatar,
          }
        : String(organizer),
    date: obj.date,
    endDate: obj.endDate ?? undefined,
    location: obj.location,
    country: obj.country,
    city: obj.city,
    isOnline: obj.isOnline ?? false,
    link: obj.link ?? undefined,
    category: obj.category as EventDTO['category'],
    tags: obj.tags ?? [],
    attendees: (obj.attendees ?? []).map((a: any) =>
      typeof a === 'object' && a._id ? a._id.toString() : String(a)
    ),
    maxAttendees: obj.maxAttendees ?? undefined,
    image: obj.image ?? undefined,
    status: obj.status as EventDTO['status'],
    createdAt: (obj as any).createdAt,
    updatedAt: (obj as any).updatedAt,
  };
}

export class EventService {
  async createEvent(authorId: string, dto: CreateEventDTO): Promise<EventDTO> {
    const event = new EventModel({
      ...dto,
      organizer: authorId,
      status: dto.status ?? 'upcoming',
      tags: dto.tags ?? [],
      isOnline: dto.isOnline ?? false,
    });

    const saved = await event.save();
    await saved.populate('organizer', 'name username avatar');
    return toEventDTO(saved);
  }

  async searchEvents(params: EventSearchParams): Promise<EventSearchResult> {
    const {
      country,
      city,
      category,
      status,
      dateFrom,
      dateTo,
      search,
      page = 1,
      limit,
    } = params;

    const safeLimit = Math.min(limit && limit > 0 ? limit : DEFAULT_LIMIT, MAX_LIMIT);
    const safePage = page > 0 ? page : 1;
    const skip = (safePage - 1) * safeLimit;

    const query: Record<string, unknown> = {};

    if (country) query.country = country;
    if (city) query.city = city;
    if (category) query.category = category;
    if (status) query.status = status;

    if (dateFrom || dateTo) {
      const dateFilter: Record<string, Date> = {};
      if (dateFrom) dateFilter.$gte = new Date(dateFrom);
      if (dateTo) dateFilter.$lte = new Date(dateTo);
      query.date = dateFilter;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const [docs, total] = await Promise.all([
      EventModel.find(query)
        .populate('organizer', 'name username avatar')
        .sort({ date: 1 })
        .skip(skip)
        .limit(safeLimit)
        .exec(),
      EventModel.countDocuments(query).exec(),
    ]);

    return {
      events: docs.map(toEventDTO),
      total,
      page: safePage,
      limit: safeLimit,
      hasMore: skip + docs.length < total,
    };
  }

  async getById(id: string): Promise<EventDTO | null> {
    const doc = await EventModel.findById(id)
      .populate('organizer', 'name username avatar')
      .exec();

    if (!doc) return null;
    return toEventDTO(doc);
  }

  async getUpcoming(limit = 10): Promise<EventDTO[]> {
    const safeLimit = Math.min(limit > 0 ? limit : 10, MAX_LIMIT);
    const now = new Date();

    const docs = await EventModel.find({
      status: 'upcoming',
      date: { $gte: now },
    })
      .populate('organizer', 'name username avatar')
      .sort({ date: 1 })
      .limit(safeLimit)
      .exec();

    return docs.map(toEventDTO);
  }

  async attendEvent(eventId: string, userId: string): Promise<EventDTO> {
    const event = await EventModel.findById(eventId);

    if (!event) {
      throw new Error('EVENT_NOT_FOUND');
    }

    if (event.status === 'cancelled') {
      throw new Error('EVENT_CANCELLED');
    }

    if (event.status === 'past') {
      throw new Error('EVENT_PAST');
    }

    const alreadyAttending = (event.attendees as any[]).some(
      (a) => a.toString() === userId
    );

    if (alreadyAttending) {
      throw new Error('ALREADY_ATTENDING');
    }

    if (
      event.maxAttendees !== undefined &&
      event.maxAttendees !== null &&
      (event.attendees as any[]).length >= event.maxAttendees
    ) {
      throw new Error('EVENT_FULL');
    }

    const updated = await EventModel.findByIdAndUpdate(
      eventId,
      { $addToSet: { attendees: userId } },
      { new: true }
    )
      .populate('organizer', 'name username avatar')
      .exec();

    return toEventDTO(updated!);
  }

  async unattendEvent(eventId: string, userId: string): Promise<EventDTO> {
    const event = await EventModel.findById(eventId);

    if (!event) {
      throw new Error('EVENT_NOT_FOUND');
    }

    const updated = await EventModel.findByIdAndUpdate(
      eventId,
      { $pull: { attendees: userId } },
      { new: true }
    )
      .populate('organizer', 'name username avatar')
      .exec();

    return toEventDTO(updated!);
  }

  async updateEvent(id: string, authorId: string, dto: UpdateEventDTO): Promise<EventDTO> {
    const event = await EventModel.findById(id);

    if (!event) {
      throw new Error('EVENT_NOT_FOUND');
    }

    const organizerId =
      typeof event.organizer === 'object' && event.organizer !== null
        ? (event.organizer as any).toString()
        : String(event.organizer);

    if (organizerId !== authorId) {
      throw new Error('EVENT_UNAUTHORIZED');
    }

    const updated = await EventModel.findByIdAndUpdate(
      id,
      { $set: dto },
      { new: true, runValidators: true }
    )
      .populate('organizer', 'name username avatar')
      .exec();

    return toEventDTO(updated!);
  }

  async deleteEvent(id: string, authorId: string): Promise<void> {
    const event = await EventModel.findById(id);

    if (!event) {
      throw new Error('EVENT_NOT_FOUND');
    }

    const organizerId =
      typeof event.organizer === 'object' && event.organizer !== null
        ? (event.organizer as any).toString()
        : String(event.organizer);

    if (organizerId !== authorId) {
      throw new Error('EVENT_UNAUTHORIZED');
    }

    await EventModel.findByIdAndDelete(id);
  }
}

export const eventService = new EventService();

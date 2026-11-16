import type { EventDoc } from '../models/event.model';

export type EventCategory =
  | 'career_fair'
  | 'open_day'
  | 'visa_workshop'
  | 'networking'
  | 'cultural'
  | 'other';

export type EventStatus = 'upcoming' | 'ongoing' | 'past' | 'cancelled';

export interface EventDTO {
  id: string;
  title: string;
  description: string;
  organizer: string | { id: string; name: string; username: string; avatar?: string };
  date: Date;
  endDate?: Date;
  location: string;
  country: string;
  city: string;
  isOnline: boolean;
  link?: string;
  category: EventCategory;
  tags: string[];
  attendees: string[];
  maxAttendees?: number;
  image?: string;
  status: EventStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEventDTO {
  title: string;
  description: string;
  date: Date | string;
  endDate?: Date | string;
  location: string;
  country: string;
  city: string;
  isOnline?: boolean;
  link?: string;
  category: EventCategory;
  tags?: string[];
  maxAttendees?: number;
  image?: string;
  status?: EventStatus;
}

export interface UpdateEventDTO {
  title?: string;
  description?: string;
  date?: Date | string;
  endDate?: Date | string;
  location?: string;
  country?: string;
  city?: string;
  isOnline?: boolean;
  link?: string;
  category?: EventCategory;
  tags?: string[];
  maxAttendees?: number;
  image?: string;
  status?: EventStatus;
}

export interface EventSearchParams {
  country?: string;
  city?: string;
  category?: EventCategory;
  status?: EventStatus;
  dateFrom?: Date | string;
  dateTo?: Date | string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface EventSearchResult {
  events: EventDTO[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

import {
  Schema,
  model,
  type InferSchemaType,
  type HydratedDocument,
  type Model,
} from 'mongoose';

const EVENT_CATEGORIES = [
  'career_fair',
  'open_day',
  'visa_workshop',
  'networking',
  'cultural',
  'other',
] as const;

const EVENT_STATUSES = ['upcoming', 'ongoing', 'past', 'cancelled'] as const;

const EventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    } as { type: typeof Schema.Types.ObjectId; ref: 'User' },
    date: { type: Date, required: true },
    endDate: { type: Date, required: false },
    location: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    isOnline: { type: Boolean, default: false },
    link: { type: String, trim: true },
    category: {
      type: String,
      enum: EVENT_CATEGORIES,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    attendees: {
      type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      default: [],
    },
    maxAttendees: { type: Number, min: 1 },
    image: { type: String, trim: true },
    status: {
      type: String,
      enum: EVENT_STATUSES,
      default: 'upcoming',
      required: true,
    },
  },
  { timestamps: true }
);

EventSchema.index({ date: 1 });
EventSchema.index({ country: 1 });
EventSchema.index({ category: 1 });
EventSchema.index({ status: 1 });
EventSchema.index({ status: 1, date: 1 });
EventSchema.index({ title: 'text', description: 'text' });

export type Event = InferSchemaType<typeof EventSchema>;
export type EventDoc = HydratedDocument<Event>;

export const EventModel: Model<Event> = model<Event>('Event', EventSchema);

import mongoose, { Schema, Document } from 'mongoose';

export type ApplicationStatus = 'interested' | 'applied' | 'waiting' | 'accepted' | 'rejected';

export interface ITrackerEntry extends Document {
  userId: mongoose.Types.ObjectId;
  universityName: string;
  country: string;
  programme: string;
  status: ApplicationStatus;
  notes: string;
  deadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TrackerEntrySchema = new Schema<ITrackerEntry>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    universityName: { type: String, required: true, trim: true },
    country: { type: String, default: '', trim: true },
    programme: { type: String, default: '', trim: true },
    status: {
      type: String,
      enum: ['interested', 'applied', 'waiting', 'accepted', 'rejected'],
      default: 'interested',
    },
    notes: { type: String, default: '', trim: true },
    deadline: { type: Date },
  },
  { timestamps: true }
);

export const TrackerEntry = mongoose.model<ITrackerEntry>('TrackerEntry', TrackerEntrySchema);

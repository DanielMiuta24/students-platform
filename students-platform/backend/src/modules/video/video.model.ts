import mongoose, { Schema, Document } from 'mongoose';

export type VideoCategory = 'visa' | 'scholarships' | 'campus-life' | 'housing' | 'student-life' | 'interviews' | 'other';

export interface IVideo extends Document {
  title: string;
  youtubeUrl: string;
  videoId: string;
  category: VideoCategory;
  country: string;
  description: string;
  submittedBy: mongoose.Types.ObjectId;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema = new Schema<IVideo>(
  {
    title: { type: String, required: true, trim: true },
    youtubeUrl: { type: String, required: true, trim: true },
    videoId: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['visa', 'scholarships', 'campus-life', 'housing', 'student-life', 'interviews', 'other'],
      default: 'other',
    },
    country: { type: String, default: '', trim: true },
    description: { type: String, default: '', trim: true },
    submittedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Video = mongoose.model<IVideo>('Video', VideoSchema);

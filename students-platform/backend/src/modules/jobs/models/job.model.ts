import {
  Schema,
  model,
  type InferSchemaType,
  type HydratedDocument,
  type Model,
} from 'mongoose';
import { JobType, JobMode, JobStatus } from '../types/job.types';

const JobSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    requirements: { type: [String], default: [] },
    location: { type: String, trim: true },
    country: { type: String, required: true, trim: true },
    city: { type: String, trim: true },
    type: {
      type: String,
      enum: Object.values(JobType),
      required: true,
    },
    mode: {
      type: String,
      enum: Object.values(JobMode),
      required: true,
    },
    salary: { type: String, trim: true },
    currency: { type: String, trim: true },
    deadline: { type: Date },
    applyLink: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    } as { type: typeof Schema.Types.ObjectId; ref: 'User' },
    savedBy: {
      type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      default: [],
    },
    status: {
      type: String,
      enum: Object.values(JobStatus),
      default: JobStatus.OPEN,
      required: true,
    },
  },
  { timestamps: true }
);

JobSchema.index({ country: 1 });
JobSchema.index({ type: 1 });
JobSchema.index({ status: 1 });
JobSchema.index({ createdAt: -1 });
JobSchema.index({ title: 'text', company: 'text', description: 'text' });

export type Job = InferSchemaType<typeof JobSchema>;
export type JobDoc = HydratedDocument<Job>;

export const JobModel: Model<Job> = model<Job>('Job', JobSchema);

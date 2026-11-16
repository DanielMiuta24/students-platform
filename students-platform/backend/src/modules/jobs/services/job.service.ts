import { JobModel, type JobDoc } from '../models/job.model';
import { JobStatus } from '../types/job.types';
import type { CreateJobDTO, UpdateJobDTO, SearchJobsDTO, JobsResult } from '../types/job.types';

const JOB_ERROR = {
  NOT_FOUND: 'JOB_NOT_FOUND',
  UNAUTHORIZED: 'JOB_UNAUTHORIZED',
} as const;

export class JobService {
  private readonly DEFAULT_LIMIT = 20;

  async createJob(userId: string, dto: CreateJobDTO): Promise<JobDoc> {
    const job = new JobModel({
      ...dto,
      postedBy: userId,
      status: JobStatus.OPEN,
    });
    await job.save();
    await job.populate('postedBy', 'name username avatar email');
    return job;
  }

  async searchJobs(params: SearchJobsDTO): Promise<JobsResult> {
    const {
      page = 1,
      limit = this.DEFAULT_LIMIT,
      country,
      type,
      mode,
      status = JobStatus.OPEN,
      search,
    } = params;

    const filter: Record<string, unknown> = { status };

    if (country) {
      filter['country'] = country;
    }

    if (type) {
      filter['type'] = type;
    }

    if (mode) {
      filter['mode'] = mode;
    }

    if (search) {
      filter['$text'] = { $search: search };
    }

    const safePage = Math.max(1, page);
    const safeLimit = Math.min(Math.max(1, limit), 100);
    const skip = (safePage - 1) * safeLimit;

    const [jobs, total] = await Promise.all([
      JobModel.find(filter)
        .populate('postedBy', 'name username avatar email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .exec(),
      JobModel.countDocuments(filter),
    ]);

    return {
      jobs,
      total,
      page: safePage,
      limit: safeLimit,
      hasMore: skip + jobs.length < total,
    };
  }

  async getById(id: string): Promise<JobDoc | null> {
    const job = await JobModel.findById(id)
      .populate('postedBy', 'name username avatar email')
      .exec();
    return job;
  }

  async saveJob(jobId: string, userId: string): Promise<JobDoc> {
    const job = await JobModel.findByIdAndUpdate(
      jobId,
      { $addToSet: { savedBy: userId } },
      { new: true, runValidators: true }
    )
      .populate('postedBy', 'name username avatar email')
      .exec();

    if (!job) {
      throw new Error(JOB_ERROR.NOT_FOUND);
    }

    return job;
  }

  async unsaveJob(jobId: string, userId: string): Promise<JobDoc> {
    const job = await JobModel.findByIdAndUpdate(
      jobId,
      { $pull: { savedBy: userId } },
      { new: true, runValidators: true }
    )
      .populate('postedBy', 'name username avatar email')
      .exec();

    if (!job) {
      throw new Error(JOB_ERROR.NOT_FOUND);
    }

    return job;
  }

  async getSavedJobs(userId: string): Promise<JobDoc[]> {
    const jobs = await JobModel.find({ savedBy: userId })
      .populate('postedBy', 'name username avatar email')
      .sort({ createdAt: -1 })
      .exec();
    return jobs;
  }

  async getMyJobs(userId: string): Promise<JobDoc[]> {
    const jobs = await JobModel.find({ postedBy: userId })
      .sort({ createdAt: -1 })
      .exec();
    return jobs;
  }

  async updateJob(id: string, userId: string, dto: UpdateJobDTO): Promise<JobDoc> {
    const existing = await JobModel.findById(id);

    if (!existing) {
      throw new Error(JOB_ERROR.NOT_FOUND);
    }

    const posterId = existing.postedBy?.toString();
    if (posterId !== userId) {
      throw new Error(JOB_ERROR.UNAUTHORIZED);
    }

    const updated = await JobModel.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    })
      .populate('postedBy', 'name username avatar email')
      .exec();

    return updated!;
  }

  async deleteJob(id: string, userId: string): Promise<void> {
    const existing = await JobModel.findById(id);

    if (!existing) {
      throw new Error(JOB_ERROR.NOT_FOUND);
    }

    const posterId = existing.postedBy?.toString();
    if (posterId !== userId) {
      throw new Error(JOB_ERROR.UNAUTHORIZED);
    }

    await JobModel.findByIdAndDelete(id);
  }

  async closeJob(id: string, userId: string): Promise<JobDoc> {
    const existing = await JobModel.findById(id);

    if (!existing) {
      throw new Error(JOB_ERROR.NOT_FOUND);
    }

    const posterId = existing.postedBy?.toString();
    if (posterId !== userId) {
      throw new Error(JOB_ERROR.UNAUTHORIZED);
    }

    const updated = await JobModel.findByIdAndUpdate(
      id,
      { status: JobStatus.CLOSED },
      { new: true, runValidators: true }
    )
      .populate('postedBy', 'name username avatar email')
      .exec();

    return updated!;
  }
}

export { JOB_ERROR };
export const jobService = new JobService();

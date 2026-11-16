import type { Request, Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../../../shared/middleware/auth.middleware';
import { jobService, JOB_ERROR } from '../services/job.service';
import type { SearchJobsDTO } from '../types/job.types';
import { JobType, JobMode, JobStatus } from '../types/job.types';

class JobController {
  private static readonly HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    FORBIDDEN: 403,
  } as const;

  private static readonly ERROR_RESPONSES: Record<string, { status: number; message: string }> = {
    [JOB_ERROR.NOT_FOUND]: {
      status: 404,
      message: 'Job not found',
    },
    [JOB_ERROR.UNAUTHORIZED]: {
      status: 403,
      message: 'You are not authorized to perform this action',
    },
  };

  private handleError(err: unknown, res: Response, next: NextFunction): Response | void {
    if (!(err instanceof Error)) {
      return next(err);
    }

    const errorResponse = JobController.ERROR_RESPONSES[err.message];

    if (errorResponse) {
      return res.status(errorResponse.status).json({
        message: errorResponse.message,
      });
    }

    return next(err);
  }

  searchJobs = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;
      const params: SearchJobsDTO = {
        page,
        limit,
        country: req.query.country as string | undefined,
        type: req.query.type as JobType | undefined,
        mode: req.query.mode as JobMode | undefined,
        status: (req.query.status as JobStatus | undefined) ?? JobStatus.OPEN,
        search: req.query.search as string | undefined,
      };

      const result = await jobService.searchJobs(params);
      return res.status(JobController.HTTP_STATUS.OK).json(result);
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  getJobById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const job = await jobService.getById(req.params.id);

      if (!job) {
        return res.status(JobController.HTTP_STATUS.NOT_FOUND).json({ message: 'Job not found' });
      }

      return res.status(JobController.HTTP_STATUS.OK).json({ job });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  createJob = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const job = await jobService.createJob(req.user!.id, req.body);
      return res.status(JobController.HTTP_STATUS.CREATED).json({
        message: 'Job created successfully',
        job,
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  updateJob = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const job = await jobService.updateJob(req.params.id, req.user!.id, req.body);
      return res.status(JobController.HTTP_STATUS.OK).json({
        message: 'Job updated successfully',
        job,
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  deleteJob = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await jobService.deleteJob(req.params.id, req.user!.id);
      return res.status(JobController.HTTP_STATUS.OK).json({
        message: 'Job deleted successfully',
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  saveJob = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const job = await jobService.saveJob(req.params.id, req.user!.id);
      return res.status(JobController.HTTP_STATUS.OK).json({
        message: 'Job saved successfully',
        job,
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  unsaveJob = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const job = await jobService.unsaveJob(req.params.id, req.user!.id);
      return res.status(JobController.HTTP_STATUS.OK).json({
        message: 'Job unsaved successfully',
        job,
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  getSavedJobs = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const jobs = await jobService.getSavedJobs(req.user!.id);
      return res.status(JobController.HTTP_STATUS.OK).json({ jobs });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  getMyJobs = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const jobs = await jobService.getMyJobs(req.user!.id);
      return res.status(JobController.HTTP_STATUS.OK).json({ jobs });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };

  closeJob = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const job = await jobService.closeJob(req.params.id, req.user!.id);
      return res.status(JobController.HTTP_STATUS.OK).json({
        message: 'Job closed successfully',
        job,
      });
    } catch (err: unknown) {
      return this.handleError(err, res, next);
    }
  };
}

export const jobController = new JobController();

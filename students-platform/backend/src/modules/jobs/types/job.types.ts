export enum JobType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  INTERNSHIP = 'internship',
  DUAL_STUDY = 'dual_study',
  WORKING_STUDENT = 'working_student',
}

export enum JobMode {
  ONSITE = 'onsite',
  REMOTE = 'remote',
  HYBRID = 'hybrid',
}

export enum JobStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  EXPIRED = 'expired',
}

export interface CreateJobDTO {
  title: string;
  company: string;
  description: string;
  requirements?: string[];
  location?: string;
  country: string;
  city?: string;
  type: JobType;
  mode: JobMode;
  salary?: string;
  currency?: string;
  deadline?: Date;
  applyLink: string;
  tags?: string[];
}

export interface UpdateJobDTO {
  title?: string;
  company?: string;
  description?: string;
  requirements?: string[];
  location?: string;
  country?: string;
  city?: string;
  type?: JobType;
  mode?: JobMode;
  salary?: string;
  currency?: string;
  deadline?: Date;
  applyLink?: string;
  tags?: string[];
}

export interface SearchJobsDTO {
  page?: number;
  limit?: number;
  country?: string;
  type?: JobType;
  mode?: JobMode;
  status?: JobStatus;
  search?: string;
}

export interface JobsResult {
  jobs: unknown[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

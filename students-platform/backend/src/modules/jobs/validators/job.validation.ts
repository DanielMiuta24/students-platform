import { body, param, query } from 'express-validator';
import { JobType, JobMode } from '../types/job.types';

export const validateCreateJob = [
  body('title').notEmpty().withMessage('Title is required').trim(),
  body('company').notEmpty().withMessage('Company is required').trim(),
  body('description').notEmpty().withMessage('Description is required'),
  body('country').notEmpty().withMessage('Country is required').trim(),
  body('type')
    .isIn(Object.values(JobType))
    .withMessage(`Type must be one of: ${Object.values(JobType).join(', ')}`),
  body('mode')
    .isIn(Object.values(JobMode))
    .withMessage(`Mode must be one of: ${Object.values(JobMode).join(', ')}`),
  body('applyLink').notEmpty().withMessage('Apply link is required').isURL().withMessage('Apply link must be a valid URL'),
  body('requirements').optional().isArray().withMessage('Requirements must be an array'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('deadline').optional().isISO8601().withMessage('Deadline must be a valid date'),
];

export const validateUpdateJob = [
  param('id').isMongoId().withMessage('Invalid job ID'),
  body('title').optional().notEmpty().trim(),
  body('company').optional().notEmpty().trim(),
  body('description').optional().notEmpty(),
  body('country').optional().notEmpty().trim(),
  body('type').optional().isIn(Object.values(JobType)),
  body('mode').optional().isIn(Object.values(JobMode)),
  body('applyLink').optional().isURL().withMessage('Apply link must be a valid URL'),
  body('requirements').optional().isArray(),
  body('tags').optional().isArray(),
  body('deadline').optional().isISO8601(),
];

export const validateJobId = [
  param('id').isMongoId().withMessage('Invalid job ID'),
];

export const validateSearchJobs = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('type').optional().isIn(Object.values(JobType)),
  query('mode').optional().isIn(Object.values(JobMode)),
];

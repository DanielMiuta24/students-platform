import { z } from 'zod';
import { NOTIFICATION_TYPES, TARGET_MODELS } from '../../../shared/types/domain';
import { NOTIFICATION_PAGINATION } from '../constants';

export const CreateNotificationSchema = z.object({
  recipientId: z.string().min(1, 'Recipient ID is required'),
  actorId: z.string().min(1, 'Actor ID is required'),
  type: z.enum(NOTIFICATION_TYPES as unknown as [string, ...string[]]),
  targetModel: z.enum(TARGET_MODELS as unknown as [string, ...string[]]),
  targetId: z.string().min(1, 'Target ID is required'),
});

export const NotificationQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : NOTIFICATION_PAGINATION.DEFAULT_PAGE))
    .refine((val) => val > 0, 'Page must be greater than 0'),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : NOTIFICATION_PAGINATION.DEFAULT_LIMIT))
    .refine(
      (val) => val > 0 && val <= NOTIFICATION_PAGINATION.MAX_LIMIT,
      `Limit must be between 1 and ${NOTIFICATION_PAGINATION.MAX_LIMIT}`
    ),
  unreadOnly: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
});

export const MarkAsReadSchema = z.object({
  notificationId: z.string().min(1, 'Notification ID is required'),
});

export const DeleteNotificationSchema = z.object({
  notificationId: z.string().min(1, 'Notification ID is required'),
});

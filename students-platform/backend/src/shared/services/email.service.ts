import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';
import { env } from '../../config/env';
import type { NotificationType } from '../types/domain';
import { NOTIFICATION_EMAIL_SUBJECTS } from '../../modules/notification/constants';

interface SendNotificationEmailDTO {
  recipientEmail: string;
  recipientName: string;
  actorName: string;
  notificationType: NotificationType;
  targetDescription: string;
  actionUrl: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    if (!env.SMTP_HOST || !env.SMTP_PORT || !env.SMTP_USER || !env.SMTP_PASS) {
      console.warn('Email service not configured. SMTP settings are missing.');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }

  async sendNotificationEmail(data: SendNotificationEmailDTO): Promise<void> {
    if (!this.transporter) {
      console.warn('Email transporter not configured. Skipping email notification.');
      return;
    }

    const subject = NOTIFICATION_EMAIL_SUBJECTS[data.notificationType];
    const action = this.getActionText(data.notificationType);
    const message = this.getMessage(data.notificationType);

    const templatePath = path.join(__dirname, '../../shared/email-templates/notification.html');
    let htmlTemplate = await fs.readFile(templatePath, 'utf-8');

    htmlTemplate = htmlTemplate
      .replace('{{subject}}', subject)
      .replace('{{actorName}}', data.actorName)
      .replace('{{action}}', action)
      .replace('{{targetDescription}}', data.targetDescription)
      .replace('{{message}}', message)
      .replace('{{actionUrl}}', data.actionUrl);

    await this.transporter.sendMail({
      from: env.SMTP_FROM || 'Students Platform <noreply@studentsplatform.com>',
      to: data.recipientEmail,
      subject,
      html: htmlTemplate,
    });
  }

  private getActionText(type: NotificationType): string {
    const actions: Record<NotificationType, string> = {
      comment: 'commented on',
      reply: 'replied to your comment on',
      like: 'liked',
      follow: 'started following you',
      view: 'viewed your profile',
      message: 'sent you a message',
      new_post: 'created a new post',
      community_join: 'joined your community',
      community_post: 'posted in',
      community_invite: 'invited you to',
      community_join_request: 'requested to join',
      community_join_approved: 'approved your request to join',
      community_join_request_rejected: 'rejected your request to join',
      community_invite_rejected: 'rejected your invite to',
      admin_assign: 'assigned you as an admin in',
      ownership_transfer_request: 'requested to transfer ownership to you for',
      ownership_transfer: 'transferred ownership to you for',
      ownership_transfer_rejected: 'rejected ownership transfer for',
    };
    return actions[type] || 'interacted with';
  }

  private getMessage(type: NotificationType): string {
    const messages: Record<NotificationType, string> = {
      comment: 'See what they said and continue the conversation.',
      reply: 'Check out their response and keep the discussion going.',
      like: 'Someone appreciates your content!',
      follow: 'You have a new follower on your profile.',
      view: 'Someone is interested in your profile.',
      message: 'You have received a new message.',
      new_post: 'Check out their latest post.',
      community_join: 'Your community is growing!',
      community_post: 'New content in your community.',
      community_invite: 'You have been invited to join a community.',
      community_join_request: 'Review their request to join your community.',
      community_join_approved: 'You can now access the community and participate.',
      community_join_request_rejected: 'Your join request was not approved.',
      community_invite_rejected: 'Your invitation was declined.',
      admin_assign: 'You now have admin privileges in this community.',
      ownership_transfer_request: 'Review the ownership transfer request.',
      ownership_transfer: 'You are now the owner of this community.',
      ownership_transfer_rejected: 'The ownership transfer was declined.',
    };
    return messages[type] || 'Check it out!';
  }
}

export const emailService = new EmailService();

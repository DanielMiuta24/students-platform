import type { Request, Response, NextFunction } from 'express';
import { emailService } from '../../shared/services/email.service';
import { env } from '../../config/env';
import nodemailer from 'nodemailer';

class SupportController {
  submitReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { problemType, subject, description, email, priority } = req.body;

      if (!problemType || !subject || !description || !email || !priority) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      if (env.SMTP_USER && env.SMTP_PASS) {
        const transporter = nodemailer.createTransport({
          host: env.SMTP_HOST,
          port: env.SMTP_PORT,
          secure: env.SMTP_PORT === 465,
          auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
        });

        const priorityLabel = (priority as string).toUpperCase();
        const htmlBody = `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:#0F2A5F;color:white;padding:20px;text-align:center;">
              <h1 style="margin:0;">ISC Support Report</h1>
            </div>
            <div style="padding:24px;background:#f9fafb;">
              <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
                <tr><td style="padding:8px;font-weight:bold;color:#374151;">Type:</td><td style="padding:8px;">${problemType}</td></tr>
                <tr><td style="padding:8px;font-weight:bold;color:#374151;">Priority:</td><td style="padding:8px;">${priority}</td></tr>
                <tr><td style="padding:8px;font-weight:bold;color:#374151;">From:</td><td style="padding:8px;">${email}</td></tr>
                <tr><td style="padding:8px;font-weight:bold;color:#374151;">Subject:</td><td style="padding:8px;">${subject}</td></tr>
              </table>
              <div style="background:white;border-radius:8px;padding:16px;border-left:4px solid #2563EB;">
                <p style="margin:0;white-space:pre-line;">${description}</p>
              </div>
            </div>
          </div>`;

        await transporter.sendMail({
          from: env.SMTP_FROM || env.SMTP_USER,
          to: env.SMTP_USER,
          replyTo: email,
          subject: `[ISC Support] [${priorityLabel}] ${subject}`,
          text: `Type: ${problemType}\nPriority: ${priority}\nFrom: ${email}\n\n${description}`,
          html: htmlBody,
        });
      }

      return res.status(200).json({ success: true, message: 'Report submitted successfully' });
    } catch (err) {
      return next(err);
    }
  };
}

export const supportController = new SupportController();

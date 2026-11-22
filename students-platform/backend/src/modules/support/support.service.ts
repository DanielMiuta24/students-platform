import { emailService } from '../../shared/services/email.service';

export interface SubmitSupportReportDTO {
  problemType: string;
  subject: string;
  description: string;
  email: string;
  priority: string;
}

class SupportService {
  async submitReport(data: SubmitSupportReportDTO): Promise<void> {
    emailService.sendSupportReport({
      problemType: data.problemType,
      subject: data.subject,
      description: data.description,
      email: data.email,
      priority: data.priority,
    }).catch(err => console.error('Failed to send support email:', err));
  }
}

export const supportService = new SupportService();

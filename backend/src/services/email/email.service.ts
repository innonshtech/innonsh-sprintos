import prisma from '../../utils/prisma';
import { SendTaskAssignedMailParams } from './email.types';
import { MAIL_FROM, MAIL_CC, EMAIL_MAPPINGS } from './email.constants';
import { getTaskAssignedTemplate } from './templates/taskAssignedTemplate';
import { transporter } from './transporter';

export class EmailService {
  /**
   * Logs email sending attempts to the database
   */
  private async logEmail(
    taskId: string,
    recipient: string,
    subject: string,
    status: 'sent' | 'failed' | 'queued',
    errorMessage?: string
  ) {
    try {
      await prisma.emailLog.create({
        data: {
          taskId,
          recipient,
          subject,
          status,
          provider: 'Nodemailer',
          errorMessage
        }
      });
    } catch (dbError) {
      console.error('Failed to log email to database:', dbError);
    }
  }

  async sendTaskAssignedMail(params: SendTaskAssignedMailParams): Promise<boolean> {
    const subject = `[ SprintOS ] New Task Assigned — ${params.taskKey}`;
    
    // Resolve email: Prefer passed email (from user table), fallback to mapping
    const toEmail = params.assigneeEmail || EMAIL_MAPPINGS[params.assigneeName] || 'unknown@innonsh.com';

    try {
      if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
        console.warn('MAIL_USER or MAIL_PASS is missing. Mocking email send.');
        await this.logEmail(params.taskId, toEmail, subject, 'failed', 'Missing Gmail SMTP Credentials');
        return false;
      }

      const html = getTaskAssignedTemplate(params);

      await transporter.sendMail({
        from: MAIL_FROM,
        to: toEmail,
        cc: MAIL_CC,
        subject,
        html,
      });

      console.log('Task assignment mail sent successfully');
      await this.logEmail(params.taskId, toEmail, subject, 'sent');
      return true;
    } catch (error: any) {
      console.error('Task assignment mail failed:', error.message);
      await this.logEmail(params.taskId, toEmail, subject, 'failed', error.message);
      return false;
    }
  }

  // Stubs for future implementation
  async sendBlockerEscalationMail() {
    console.log('Not implemented yet');
  }

  async sendSprintStartedMail() {
    console.log('Not implemented yet');
  }
}

export const emailService = new EmailService();

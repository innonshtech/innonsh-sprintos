import { emailService } from '../email/email.service';
import { SendTaskAssignedMailParams } from '../email/email.types';

export class NotificationService {
  async handleTaskAssignment(params: SendTaskAssignedMailParams): Promise<boolean> {
    try {
      // Future: Could add in-app notification logic here
      // await inAppNotificationService.notify(...)
      
      // Send email
      const emailTriggered = await emailService.sendTaskAssignedMail(params);
      return emailTriggered;
    } catch (error) {
      console.error('Notification Service Error (handleTaskAssignment):', error);
      return false;
    }
  }
}

export const notificationService = new NotificationService();

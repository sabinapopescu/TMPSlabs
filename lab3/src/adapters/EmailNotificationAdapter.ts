import { INotification, NotificationMessage, NotificationResult } from "./INotification.js";
import { EmailService } from "./EmailService.js";

/**
 * EmailNotificationAdapter - Adapter
 * 
 * STRUCTURAL PATTERN: Adapter
 * Purpose: Adapts the EmailService (Adaptee) to the INotification interface (Target)
 * 
 * This adapter allows the EmailService to be used through the common
 * INotification interface, making it interchangeable with other notification services.
 */
export class EmailNotificationAdapter implements INotification {
  private emailService: EmailService;
  private fromAddress: string;

  constructor(apiKey?: string, fromAddress: string = "noreply@bloomify.com") {
    this.emailService = new EmailService(apiKey);
    this.fromAddress = fromAddress;
  }

  /**
   * Adapt the send method to use EmailService's sendEmail method
   */
  send(notification: NotificationMessage): NotificationResult {
    // Transform INotification format to EmailService format
    const emailConfig = {
      from: this.fromAddress,
      to: notification.recipient,
      subject: notification.subject,
      body: notification.message,
      html: false
    };

    // Call the adaptee's method
    const response = this.emailService.sendEmail(emailConfig);

    // Transform EmailService response to NotificationResult
    return {
      success: response.sent,
      messageId: response.id,
      timestamp: new Date(response.time),
      service: this.getServiceName(),
      error: response.errorMessage
    };
  }

  /**
   * Validate email address
   */
  validate(recipient: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(recipient);
  }

  /**
   * Get service name
   */
  getServiceName(): string {
    return "Email (Adapted)";
  }
}
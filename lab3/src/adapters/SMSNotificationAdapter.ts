import { INotification, NotificationMessage, NotificationResult } from "./INotification.js";
import { SMSGateway } from "./SMSGateway.js";

/**
 * SMSNotificationAdapter - Adapter
 * 
 * STRUCTURAL PATTERN: Adapter
 * Purpose: Adapts the SMSGateway (Adaptee) to the INotification interface (Target)
 * 
 * This adapter wraps the SMS gateway and makes it compatible with
 * our unified notification interface.
 */
export class SMSNotificationAdapter implements INotification {
  private smsGateway: SMSGateway;

  constructor(accountSid?: string, authToken?: string) {
    this.smsGateway = new SMSGateway(accountSid, authToken);
  }

  /**
   * Adapt the send method to use SMSGateway's transmitSMS method
   */
  send(notification: NotificationMessage): NotificationResult {
    // Transform INotification format to SMSGateway format
    const smsPayload = {
      phoneNumber: notification.recipient,
      textMessage: `${notification.subject}\n\n${notification.message}`,
      urgent: notification.priority === "high"
    };

    // Call the adaptee's method
    const response = this.smsGateway.transmitSMS(smsPayload);

    // Transform SMSGateway response to NotificationResult
    return {
      success: response.delivered,
      messageId: response.messageGuid,
      timestamp: new Date(response.sentAt),
      service: this.getServiceName(),
      error: response.failureReason
    };
  }

  /**
   * Validate phone number
   */
  validate(recipient: string): boolean {
    // Phone number should start with + and have 10-15 digits
    const phoneRegex = /^\+\d{10,15}$/;
    return phoneRegex.test(recipient.replace(/[\s-]/g, ""));
  }

  /**
   * Get service name
   */
  getServiceName(): string {
    return "SMS (Adapted)";
  }
}
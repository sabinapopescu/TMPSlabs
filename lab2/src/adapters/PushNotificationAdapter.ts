import { INotification, NotificationMessage, NotificationResult } from "./INotification.js";
import { PushNotificationAPI } from "./PushNotificationAPI.js";

/**
 * PushNotificationAdapter - Adapter
 * 
 * STRUCTURAL PATTERN: Adapter
 * Purpose: Adapts the PushNotificationAPI (Adaptee) to the INotification interface (Target)
 * 
 * This adapter makes the push notification API compatible with our
 * unified notification system.
 */
export class PushNotificationAdapter implements INotification {
  private pushAPI: PushNotificationAPI;

  constructor(apiKey?: string) {
    this.pushAPI = new PushNotificationAPI(apiKey);
  }

  /**
   * Adapt the send method to use PushNotificationAPI's pushToDevice method
   */
  send(notification: NotificationMessage): NotificationResult {
    // Transform INotification format to PushNotificationAPI format
    const pushData = {
      deviceToken: notification.recipient,
      title: notification.subject,
      content: notification.message,
      badge: 1,
      sound: notification.priority === "high" ? "urgent.wav" : "default.wav"
    };

    // Call the adaptee's method
    const response = this.pushAPI.pushToDevice(pushData);

    // Transform PushNotificationAPI response to NotificationResult
    return {
      success: response.status === "success",
      messageId: response.notificationId,
      timestamp: new Date(response.timestamp),
      service: this.getServiceName(),
      error: response.error
    };
  }

  /**
   * Validate device token
   */
  validate(recipient: string): boolean {
    // Device tokens are typically 64+ character hex strings
    return recipient.length >= 32 && /^[a-fA-F0-9]+$/.test(recipient);
  }

  /**
   * Get service name
   */
  getServiceName(): string {
    return "Push Notification (Adapted)";
  }
}
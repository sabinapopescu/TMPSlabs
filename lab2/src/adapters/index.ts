/**
 * Adapter Pattern - Exports
 * 
 * This module exports all adapter-related classes for unified notification system
 */

export type { INotification, NotificationMessage, NotificationResult } from "./INotification.js";
export { EmailService } from "./EmailService.js";
export { EmailNotificationAdapter } from "./EmailNotificationAdapter.js";
export { SMSGateway } from "./SMSGateway.js";
export { SMSNotificationAdapter } from "./SMSNotificationAdapter.js";
export { PushNotificationAPI } from "./PushNotificationAPI.js";
export { PushNotificationAdapter } from "./PushNotificationAdapter.js";
export { NotificationManager } from "./NotificationManager.js";
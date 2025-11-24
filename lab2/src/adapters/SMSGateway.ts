/**
 * SMSGateway - External SMS Service (Adaptee)
 * 
 * STRUCTURAL PATTERN: Adapter
 * Purpose: This is an existing SMS gateway with its own interface
 *          that doesn't match our INotification interface
 * 
 * This simulates a third-party SMS API with different method signatures.
 */

export interface SMSPayload {
    phoneNumber: string;
    textMessage: string;
    urgent?: boolean;
  }
  
  export interface SMSResult {
    delivered: boolean;
    messageGuid: string;
    sentAt: string;
    failureReason?: string;
  }
  
  export class SMSGateway {
    private _accountSid: string;
    private _authToken: string;
  
    constructor(accountSid: string = "DEMO-SID", authToken: string = "DEMO-TOKEN") {
      this._accountSid = accountSid;
      this._authToken = authToken;
      void this._accountSid; // Stored for future authentication use
      void this._authToken; // Stored for future authentication use
    }
  
    /**
     * Transmit SMS - note the different method name and signature
     */
    transmitSMS(payload: SMSPayload): SMSResult {
      console.log(`[SMSGateway] Sending SMS to ${payload.phoneNumber}`);
      console.log(`[SMSGateway] Message: ${payload.textMessage}`);
      console.log(`[SMSGateway] Urgent: ${payload.urgent || false}`);
  
      // Validate phone number
      if (!this.isValidPhoneNumber(payload.phoneNumber)) {
        return {
          delivered: false,
          messageGuid: "",
          sentAt: new Date().toISOString(),
          failureReason: "Invalid phone number format"
        };
      }
  
      // Simulate successful transmission
      return {
        delivered: true,
        messageGuid: `SMS-${Math.random().toString(36).substr(2, 12).toUpperCase()}`,
        sentAt: new Date().toISOString(),
      };
    }
  
    /**
     * Validate phone number format
     */
    private isValidPhoneNumber(phone: string): boolean {
      // Simple validation: starts with + and has 10-15 digits
      const phoneRegex = /^\+\d{10,15}$/;
      return phoneRegex.test(phone.replace(/[\s-]/g, ""));
    }
  
    /**
     * Check gateway status
     */
    checkConnection(): boolean {
      return true;
    }
  }
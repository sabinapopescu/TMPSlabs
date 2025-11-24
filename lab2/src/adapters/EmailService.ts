/**
 * EmailService - External/Legacy Service (Adaptee)
 * 
 * STRUCTURAL PATTERN: Adapter
 * Purpose: This is an existing email service with its own interface
 *          that doesn't match our INotification interface
 * 
 * This simulates a third-party email API or legacy system
 * with different method names and parameters.
 */

export interface EmailConfig {
    from: string;
    to: string;
    subject: string;
    body: string;
    html?: boolean;
  }
  
  export interface EmailResponse {
    sent: boolean;
    id: string;
    time: number;
    errorMessage?: string;
  }
  
  export class EmailService {
    private _apiKey: string;
  
    constructor(apiKey: string = "DEMO-EMAIL-KEY") {
      this._apiKey = apiKey;
      void this._apiKey; // Stored for future authentication use
    }
  
    /**
     * Send email - note the different method signature from INotification
     */
    sendEmail(config: EmailConfig): EmailResponse {
      // Simulate email sending
      console.log(`[EmailService] Sending email to ${config.to}`);
      console.log(`[EmailService] Subject: ${config.subject}`);
      console.log(`[EmailService] Body: ${config.body}`);
  
      // Validate email format
      if (!this.isValidEmail(config.to)) {
        return {
          sent: false,
          id: "",
          time: Date.now(),
          errorMessage: "Invalid email address format"
        };
      }
  
      // Simulate successful send
      return {
        sent: true,
        id: `EMAIL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        time: Date.now(),
      };
    }
  
    /**
     * Validate email format
     */
    private isValidEmail(email: string): boolean {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
  
    /**
     * Get API status
     */
    getStatus(): string {
      return "EmailService API Active";
    }
  }
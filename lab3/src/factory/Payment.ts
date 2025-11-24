/**
 * Payment interface - defines the contract for all payment methods
 */
export interface Payment {
  pay(amount: number): string;
  validate(): boolean;
  getDescription(): string;
}

/**
 * Card Payment Implementation
 */
export class CardPayment implements Payment {
  constructor(private masked: string) {
    if (!masked || masked.trim().length === 0) {
      throw new Error("Card number mask cannot be empty");
    }
  }

  validate(): boolean {
    // Basic validation - check if masked format is reasonable
    const cleaned = this.masked.replace(/\s/g, '');
    return cleaned.length >= 15 && cleaned.includes('*');
  }

  pay(amount: number): string {
    if (amount <= 0) {
      throw new Error("Payment amount must be greater than 0");
    }
    
    if (!this.validate()) {
      throw new Error("Invalid card details");
    }

    return `💳 Card payment processed: ${this.masked} charged €${amount.toFixed(2)}`;
  }

  getDescription(): string {
    return `Credit/Debit Card ending in ${this.masked.slice(-4)}`;
  }
}

/**
 * Cryptocurrency Payment Implementation
 */
export class CryptoPayment implements Payment {
  constructor(
    private network: "BTC" | "ETH" | "TRX",
    private address: string
  ) {
    if (!address || address.trim().length === 0) {
      throw new Error("Wallet address cannot be empty");
    }
    if (!this.isValidNetwork(network)) {
      throw new Error(`Unsupported network: ${network}`);
    }
  }

  private isValidNetwork(network: string): network is "BTC" | "ETH" | "TRX" {
    return ["BTC", "ETH", "TRX"].includes(network);
  }

  validate(): boolean {
    // Basic validation - check address format
    if (this.network === "ETH" && this.address.startsWith("0x")) {
      return this.address.length >= 40;
    }
    if (this.network === "BTC") {
      return this.address.length >= 26 && this.address.length <= 35;
    }
    if (this.network === "TRX" && this.address.startsWith("T")) {
      return this.address.length === 34;
    }
    return this.address.length > 10;
  }

  pay(amount: number): string {
    if (amount <= 0) {
      throw new Error("Payment amount must be greater than 0");
    }
    
    if (!this.validate()) {
      throw new Error(`Invalid ${this.network} wallet address`);
    }

    const shortAddr = `${this.address.slice(0, 6)}...${this.address.slice(-4)}`;
    return `₿ Crypto payment: €${amount.toFixed(2)} sent via ${this.network} to ${shortAddr}`;
  }

  getDescription(): string {
    const shortAddr = `${this.address.slice(0, 6)}...${this.address.slice(-4)}`;
    return `${this.network} wallet: ${shortAddr}`;
  }

  getNetwork(): string {
    return this.network;
  }
}

/**
 * Bank Transfer Payment Implementation
 */
export class BankTransferPayment implements Payment {
  constructor(private iban: string) {
    if (!iban || iban.trim().length === 0) {
      throw new Error("IBAN cannot be empty");
    }
  }

  validate(): boolean {
    // Basic IBAN validation - check length and format
    const cleaned = this.iban.replace(/\s/g, '');
    return cleaned.length >= 15 && /^[A-Z]{2}[0-9]{2}/.test(cleaned);
  }

  pay(amount: number): string {
    if (amount <= 0) {
      throw new Error("Payment amount must be greater than 0");
    }
    
    if (!this.validate()) {
      throw new Error("Invalid IBAN format");
    }

    const masked = this.maskIban(this.iban);
    return `🏦 Bank transfer: €${amount.toFixed(2)} transferred to ${masked}`;
  }

  getDescription(): string {
    return `Bank account: ${this.maskIban(this.iban)}`;
  }

  private maskIban(iban: string): string {
    const cleaned = iban.replace(/\s/g, '');
    if (cleaned.length < 8) return iban;
    
    const start = cleaned.slice(0, 4);
    const end = cleaned.slice(-4);
    const middle = '*'.repeat(Math.min(cleaned.length - 8, 12));
    
    return `${start} ${middle} ${end}`;
  }
}

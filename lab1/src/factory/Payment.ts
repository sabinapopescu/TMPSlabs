// Payment.ts
export interface Payment { pay(amount: number): string; }

export class CardPayment implements Payment {
  constructor(private masked: string) {}
  pay(amount: number): string { return `CARD ${this.masked} charged ${amount.toFixed(2)}`; }
}

export class CryptoPayment implements Payment {
  constructor(private network: "BTC" | "ETH" | "TRX", private address: string) {}
  pay(amount: number): string { return `${this.network} sent ${amount.toFixed(2)} to ${this.address}`; }
}

export class BankTransferPayment implements Payment {
  constructor(private iban: string) {}
  pay(amount: number): string { return `BANK transfer ${amount.toFixed(2)} to ${this.iban}`; }
}

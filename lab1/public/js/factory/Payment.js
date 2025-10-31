export class CardPayment {
    masked;
    constructor(masked) {
        this.masked = masked;
    }
    pay(amount) { return `CARD ${this.masked} charged ${amount.toFixed(2)}`; }
}
export class CryptoPayment {
    network;
    address;
    constructor(network, address) {
        this.network = network;
        this.address = address;
    }
    pay(amount) { return `${this.network} sent ${amount.toFixed(2)} to ${this.address}`; }
}
export class BankTransferPayment {
    iban;
    constructor(iban) {
        this.iban = iban;
    }
    pay(amount) { return `BANK transfer ${amount.toFixed(2)} to ${this.iban}`; }
}

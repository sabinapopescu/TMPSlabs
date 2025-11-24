/**
 * Customer Model
 * Represents a customer with basic information
 */
export class Customer {
    constructor(name, email) {
        this.name = name;
        this.email = email;
        this.validate();
    }
    /**
     * Validate customer data
     */
    validate() {
        if (!this.name || this.name.trim().length === 0) {
            throw new Error("Customer name cannot be empty");
        }
        if (this.name.length < 2) {
            throw new Error("Customer name is too short");
        }
        if (this.name.length > 100) {
            throw new Error("Customer name is too long (max 100 characters)");
        }
        if (!this.email || this.email.trim().length === 0) {
            throw new Error("Customer email cannot be empty");
        }
        if (!this.isValidEmail(this.email)) {
            throw new Error("Invalid email format");
        }
    }
    /**
     * Validate email format
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    /**
     * Get the customer's first name
     */
    getFirstName() {
        return this.name.split(' ')[0] || this.name;
    }
    /**
     * Get the customer's display name
     */
    getDisplayName() {
        return this.name.trim();
    }
    /**
     * Get email domain
     */
    getEmailDomain() {
        return this.email.split('@')[1] || '';
    }
    /**
     * Get a masked email for privacy
     */
    getMaskedEmail() {
        const [local, domain] = this.email.split('@');
        if (!local || !domain)
            return this.email;
        const maskedLocal = local.length > 2
            ? `${local[0]}***${local[local.length - 1]}`
            : local;
        return `${maskedLocal}@${domain}`;
    }
    /**
     * Check if this customer matches another
     */
    matches(other) {
        return (this.name.toLowerCase() === other.name.toLowerCase() &&
            this.email.toLowerCase() === other.email.toLowerCase());
    }
    /**
     * Clone the customer
     */
    clone() {
        return new Customer(this.name, this.email);
    }
    /**
     * Convert to string representation
     */
    toString() {
        return `${this.name} <${this.email}>`;
    }
    /**
     * Convert to JSON-serializable object
     */
    toJSON() {
        return {
            name: this.name,
            email: this.email
        };
    }
    /**
     * Create a Customer from a JSON object
     */
    static fromJSON(data) {
        return new Customer(data.name, data.email);
    }
    /**
     * Validate customer data without creating an instance
     */
    static isValid(name, email) {
        try {
            new Customer(name, email);
            return true;
        }
        catch {
            return false;
        }
    }
}
//# sourceMappingURL=Customer.js.map
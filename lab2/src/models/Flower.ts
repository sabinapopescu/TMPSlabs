/**
 * Flower Model
 * Represents an individual flower with its properties
 */
export class Flower {
  constructor(
    public kind: string,
    public color: string,
    public unitPrice: number
  ) {
    this.validate();
  }

  /**
   * Validate flower data
   */
  private validate(): void {
    if (!this.kind || this.kind.trim().length === 0) {
      throw new Error("Flower kind cannot be empty");
    }

    if (!this.color || this.color.trim().length === 0) {
      throw new Error("Flower color cannot be empty");
    }

    if (this.unitPrice <= 0) {
      throw new Error("Unit price must be greater than 0");
    }

    if (this.unitPrice > 100) {
      throw new Error("Unit price seems unreasonably high (max 100)");
    }
  }

  /**
   * Get the display name of the flower
   */
  getDisplayName(): string {
    return `${this.color} ${this.kind}`;
  }

  /**
   * Get the emoji representation (if available)
   */
  getEmoji(): string {
    const emojiMap: Record<string, string> = {
      "Rose": "🌹",
      "Tulip": "🌷",
      "Lily": "🌺",
      "Orchid": "🌸",
      "Sunflower": "🌻",
      "Daisy": "🌼"
    };

    return emojiMap[this.kind] || "🌸";
  }

  /**
   * Check if this flower matches another
   */
  matches(other: Flower): boolean {
    return (
      this.kind === other.kind &&
      this.color === other.color &&
      this.unitPrice === other.unitPrice
    );
  }

  /**
   * Clone the flower
   */
  clone(): Flower {
    return new Flower(this.kind, this.color, this.unitPrice);
  }

  /**
   * Convert to a human-readable string
   */
  toString(): string {
    return `${this.getDisplayName()} (€${this.unitPrice.toFixed(2)})`;
  }

  /**
   * Convert to JSON-serializable object
   */
  toJSON(): any {
    return {
      kind: this.kind,
      color: this.color,
      unitPrice: this.unitPrice
    };
  }

  /**
   * Create a Flower from a JSON object
   */
  static fromJSON(data: any): Flower {
    return new Flower(data.kind, data.color, data.unitPrice);
  }

  /**
   * Get all common flower types
   */
  static getCommonTypes(): string[] {
    return ["Rose", "Tulip", "Lily", "Orchid", "Sunflower", "Daisy"];
  }

  /**
   * Get all common flower colors
   */
  static getCommonColors(): string[] {
    return ["Red", "Pink", "White", "Yellow", "Purple", "Orange"];
  }

  /**
   * Get typical price range for a flower type
   */
  static getTypicalPriceRange(kind: string): { min: number; max: number } {
    const ranges: Record<string, { min: number; max: number }> = {
      "Rose": { min: 2.0, max: 5.0 },
      "Tulip": { min: 1.5, max: 3.5 },
      "Lily": { min: 2.5, max: 4.5 },
      "Orchid": { min: 3.5, max: 6.0 },
      "Sunflower": { min: 2.0, max: 4.0 },
      "Daisy": { min: 1.0, max: 2.5 }
    };

    return ranges[kind] || { min: 1.0, max: 5.0 };
  }

  /**
   * Check if the price is within typical range
   */
  isPriceReasonable(): boolean {
    const range = Flower.getTypicalPriceRange(this.kind);
    return this.unitPrice >= range.min && this.unitPrice <= range.max * 1.5;
  }
}

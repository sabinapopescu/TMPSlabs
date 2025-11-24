import { BouquetDecorator } from "./BouquetDecorator.js";
import { IBouquetComponent } from "./IBouquetComponent.js";

/**
 * CareInstructionsDecorator - Concrete Decorator
 * 
 * STRUCTURAL PATTERN: Decorator
 * Purpose: Adds professional care instructions card to the bouquet
 * 
 * Includes a printed card with detailed care instructions for the flowers,
 * helping customers maintain their bouquet's freshness longer.
 */
export class CareInstructionsDecorator extends BouquetDecorator {
  private instructionType: "basic" | "detailed";
  private cost: number;

  constructor(component: IBouquetComponent, instructionType: "basic" | "detailed" = "basic") {
    super(component);
    this.instructionType = instructionType;
    this.cost = instructionType === "detailed" ? 3.0 : 1.5;
  }

  /**
   * Override to add care instructions to description
   */
  getDescription(): string {
    return `${super.getDescription()} with ${this.instructionType} care guide`;
  }

  /**
   * Override to add care instructions cost
   */
  getCost(): number {
    return super.getCost() + this.cost;
  }

  /**
   * Override to add care instructions details
   */
  getDetails(): string[] {
    const details = super.getDetails();
    details.push(`📋 Care Instructions: ${this.instructionType} (+€${this.cost.toFixed(2)})`);
    
    if (this.instructionType === "detailed") {
      details.push("  Includes: water change schedule, sunlight guide, trimming tips");
    }
    
    return details;
  }

  /**
   * Get instruction type
   */
  getInstructionType(): string {
    return this.instructionType;
  }
}
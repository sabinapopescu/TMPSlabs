import { IBouquetComponent } from "./IBouquetComponent.js";

/**
 * BouquetDecorator - Abstract Decorator
 * 
 * STRUCTURAL PATTERN: Decorator
 * Purpose: Base decorator class that maintains a reference to a component
 *          and delegates operations to it while allowing subclasses to add behavior
 * 
 * All concrete decorators extend this class.
 */
export abstract class BouquetDecorator implements IBouquetComponent {
  constructor(protected component: IBouquetComponent) {}

  /**
   * Default implementation delegates to the wrapped component
   */
  getDescription(): string {
    return this.component.getDescription();
  }

  /**
   * Default implementation delegates to the wrapped component
   */
  getCost(): number {
    return this.component.getCost();
  }

  /**
   * Default implementation delegates to the wrapped component
   */
  getDetails(): string[] {
    return this.component.getDetails();
  }
}
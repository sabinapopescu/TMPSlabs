/**
 * IBouquetComponent Interface
 * 
 * This is the base component interface for the Decorator Pattern.
 * Both the base Bouquet and decorators will implement this interface.
 * 
 * STRUCTURAL PATTERN: Decorator
 * Purpose: Define a common interface for both decorated and undecorated objects
 */

export interface IBouquetComponent {
  /**
   * Get the display name/description of the component
   */
  getDescription(): string;

  /**
   * Calculate the total cost of the component (including decorations)
   */
  getCost(): number;

  /**
   * Get detailed information about the component
   */
  getDetails(): string[];
}
// lab3/src/behavioral/command/OrderInvoker.ts

import { ICommand } from "./ICommand.js";

/**
 * OrderInvoker - Invoker in Command Pattern
 * 
 * BEHAVIORAL PATTERN: Command
 * Purpose: Asks the command to carry out the request and maintains
 *          command history for undo/redo operations
 * 
 * This is the invoker that executes commands and manages their history.
 */
export class OrderInvoker {
  private commandHistory: ICommand[] = [];
  private currentPosition: number = -1;
  private maxHistorySize: number;

  constructor(maxHistorySize: number = 50) {
    if (maxHistorySize <= 0) {
      throw new Error("Max history size must be greater than 0");
    }
    this.maxHistorySize = maxHistorySize;
  }

  /**
   * Execute a command and add it to history
   */
  executeCommand(command: ICommand): string {
    const result = command.execute();
    const resultStr = typeof result === 'string' ? result : ''; // Handle Promise case

    // Remove any commands after current position (they can't be redone anymore)
    if (this.currentPosition < this.commandHistory.length - 1) {
      this.commandHistory = this.commandHistory.slice(0, this.currentPosition + 1);
    }

    // Add command to history
    this.commandHistory.push(command);
    this.currentPosition++;

    // Maintain max history size
    if (this.commandHistory.length > this.maxHistorySize) {
      this.commandHistory.shift();
      this.currentPosition--;
    }

    console.log(`Executed: ${command.getDescription()}`);
    return resultStr;
  }

  /**
   * Undo the last command
   */
  undo(): string {
    if (!this.canUndo()) {
      return "Nothing to undo";
    }

    const command = this.commandHistory[this.currentPosition];
    
    if (!command) {
      return "Cannot undo: Command not found";
    }
    
    if (!command.canUndo()) {
      return `Cannot undo: ${command.getDescription()}`;
    }

    const result = command.undo();
    const resultStr = typeof result === 'string' ? result : ''; // Handle Promise case
    this.currentPosition--;

    console.log(`Undone: ${command.getDescription()}`);
    return resultStr;
  }

  /**
   * Redo the last undone command
   */
  redo(): string {
    if (!this.canRedo()) {
      return "Nothing to redo";
    }

    this.currentPosition++;
    const command = this.commandHistory[this.currentPosition];
    
    if (!command) {
      return "Cannot redo: Command not found";
    }
    
    const result = command.execute();
    const resultStr = typeof result === 'string' ? result : ''; // Handle Promise case

    console.log(`Redone: ${command.getDescription()}`);
    return resultStr;
  }

  /**
   * Check if undo is possible
   */
  canUndo(): boolean {
    const command = this.commandHistory[this.currentPosition];
    return this.currentPosition >= 0 && command !== undefined && command.canUndo();
  }

  /**
   * Check if redo is possible
   */
  canRedo(): boolean {
    return this.currentPosition < this.commandHistory.length - 1;
  }

  /**
   * Get command history
   */
  getHistory(): Array<{ description: string; timestamp: Date; canUndo: boolean }> {
    return this.commandHistory.map(cmd => ({
      description: cmd.getDescription(),
      timestamp: cmd.getTimestamp(),
      canUndo: cmd.canUndo()
    }));
  }

  /**
   * Get the current command (last executed)
   */
  getCurrentCommand(): ICommand | null {
    if (this.currentPosition < 0 || this.currentPosition >= this.commandHistory.length) {
      return null;
    }
    const command = this.commandHistory[this.currentPosition];
    return command !== undefined ? command : null;
  }

  /**
   * Get history size
   */
  getHistorySize(): number {
    return this.commandHistory.length;
  }

  /**
   * Get current position in history
   */
  getCurrentPosition(): number {
    return this.currentPosition;
  }

  /**
   * Clear command history
   */
  clearHistory(): void {
    this.commandHistory = [];
    this.currentPosition = -1;
    console.log("Command history cleared");
  }

  /**
   * Get undo/redo statistics
   */
  getStats(): {
    totalCommands: number;
    currentPosition: number;
    canUndo: boolean;
    canRedo: boolean;
    undoableCommands: number;
  } {
    const undoableCommands = this.commandHistory
      .filter(cmd => cmd.canUndo())
      .length;

    return {
      totalCommands: this.commandHistory.length,
      currentPosition: this.currentPosition,
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
      undoableCommands
    };
  }

  /**
   * Execute multiple commands in sequence (macro command)
   */
  executeCommands(commands: ICommand[]): string[] {
    return commands.map(cmd => this.executeCommand(cmd));
  }

  /**
   * Get a formatted history display
   */
  displayHistory(): string {
    if (this.commandHistory.length === 0) {
      return "No command history";
    }

    let display = "\n📜 Command History:\n";
    display += "=".repeat(50) + "\n";

    this.commandHistory.forEach((cmd, index) => {
      const marker = index === this.currentPosition ? "→" : " ";
      const time = cmd.getTimestamp().toLocaleTimeString();
      const undoable = cmd.canUndo() ? "✓" : "✗";
      
      display += `${marker} [${index + 1}] ${time} | ${cmd.getDescription()} | Undo: ${undoable}\n`;
    });

    display += "=".repeat(50) + "\n";
    display += `Current Position: ${this.currentPosition + 1}/${this.commandHistory.length}\n`;
    display += `Can Undo: ${this.canUndo() ? "Yes" : "No"} | Can Redo: ${this.canRedo() ? "Yes" : "No"}\n`;

    return display;
  }
}
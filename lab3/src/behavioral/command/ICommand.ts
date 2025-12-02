// lab3/src/behavioral/command/ICommand.ts

/**
 * Command Pattern - Command Interface
 * 
 * BEHAVIORAL PATTERN: Command
 * Purpose: Encapsulates a request as an object, allowing parameterization
 *          of clients with different requests, queuing of requests, and
 *          logging of operations. Supports undoable operations.
 */

export interface ICommand {
    /**
     * Execute the command
     * @returns Result message or data
     */
    execute(): string | Promise<string>;
  
    /**
     * Undo the command (reverse the operation)
     * @returns Result message
     */
    undo(): string | Promise<string>;
  
    /**
     * Get command description
     */
    getDescription(): string;
  
    /**
     * Get command timestamp
     */
    getTimestamp(): Date;
  
    /**
     * Check if command can be undone
     */
    canUndo(): boolean;
  }
/**
 * Observer Pattern - Observer Interface
 * Defines the update method that observers must implement
 */
import type { ISubject } from "./ISubject.js";

export interface IObserver {
    update(subject: ISubject): void;
    getName(): string;
}
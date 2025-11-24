/**
 * Observer Pattern - Subject Interface
 * Defines methods for attaching/detaching observers and notifying them
 */
import type { IObserver } from "./IObserver.js";

export interface ISubject {
    attach(observer: IObserver): void;
    detach(observer: IObserver): void;
    notify(): void;
    getState(): any;
}
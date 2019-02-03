import { Listener, ListenerCallback } from './listener';
export declare class Service {
    protected e: HTMLElement;
    addEventListener<T>(event: string, cb: ListenerCallback<T>): Listener<T>;
    dispatchEvent<T>(_event: string, data: T): void;
}

export interface ListenerCallback<T> {
    (data: T): void;
}
export declare class Listener<T> {
    protected cb: any;
    protected e: HTMLElement | Window;
    protected event: string;
    protected static counter: number;
    protected id: number;
    constructor(element: HTMLElement | Window, event: string, cb: ListenerCallback<T>);
    remove(): void;
    isRemoved(): boolean;
    getId(): number;
}

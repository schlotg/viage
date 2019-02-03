export interface Filter<T> {
    (e: T): boolean;
}
export interface Callback<T> {
    (e: T): void;
}
export interface AnimateCallback {
    (time: number): boolean;
}
export interface Validator {
    (val: string | boolean): string;
}
export interface Validators {
    [index: string]: Validator;
}
export declare function isCompatible(): boolean;
export declare function generateId(): string;
export declare function removeElement<T>(elements: T[], element: T): void;
export declare function remove<T>(elements: T[], filter: Filter<T>): void;
export declare function debounce<T>(cb: Callback<T>, delay: number): (data: T) => void;
export declare function throttle<T>(cb: Callback<T>, delay: number): (data: T) => void;
export declare function animate(cb: AnimateCallback, durationMills?: number): void;
export declare function getFormData<T>(e: HTMLElement, names: string[]): T;
export declare function setFormData<T>(e: HTMLElement, data: T): void;
export declare function setFormValidation<T>(e: HTMLElement, validators: Validators): void;
export declare function isFormValid(e: HTMLElement): HTMLInputElement[];

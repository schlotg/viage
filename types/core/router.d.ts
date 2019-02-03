import { Component } from './component';
import { Listener } from './listener';
export interface State<T extends Component> {
    name: string;
    component?: T;
    promise?: any;
    type: 'DEFAULT' | 'NORMAL';
}
export declare type StateChangedCallback = (stateInfo: StateInfo) => Promise<void>;
export interface StateInfo {
    name: string;
    data: any;
    url: string;
}
declare class InternalState {
    name: string;
    component?: any;
    promise?: any;
    data: any;
    url: string;
    componentInstance?: any;
}
export declare class Router {
    protected portal: HTMLElement;
    protected states: {
        [index: string]: State<any>;
    };
    protected currentState: InternalState;
    protected type: 'HASH' | 'LOCATION' | 'STANDALONE';
    protected history: string[];
    protected defaultState: State<any>;
    protected listener: Listener<any>;
    protected name: string;
    protected stateChangedCallback: StateChangedCallback;
    protected starting: boolean;
    constructor(portal: HTMLElement, type: 'HASH' | 'LOCATION' | 'STANDALONE', name: string);
    release(): void;
    protected decodeUrl(url: string): StateInfo;
    protected activateState(state: InternalState): Promise<{}>;
    protected error(msg: string, url: string): void;
    getName(): string;
    getType(): "HASH" | "LOCATION" | "STANDALONE";
    addStates(states: State<any>[]): void;
    removeState(name: string): void;
    clearStates(): void;
    start(): void;
    createUrl<T>(state: string, data?: T): string;
    protected _go(url: string, internalState: InternalState): void;
    protected strip(url: string): string;
    clearStateChangedCallback(): void;
    setStateChangedCallback(cb: StateChangedCallback): void;
    go(url: string): boolean;
    back(): void;
}
export declare function getRouter(name: string): Router;
export declare function createRouter(name: string, portal: HTMLElement | string, type: 'LOCATION' | 'HASH' | 'STANDALONE'): Router;
export declare function destroyRouter(name: string): void;
export {};

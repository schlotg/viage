import { Service } from '../core/service';
import { Listener, ListenerCallback } from '../core/listener';
import { Router } from '../core/router';
export declare type ForEachCb = (e: any) => void;
export declare class Component {
    e: HTMLElement;
    protected attachments: {
        [index: string]: HTMLElement;
    };
    protected a: {
        [index: string]: HTMLElement;
    };
    protected components: {
        [index: string]: Component;
    };
    protected c: {
        [index: string]: Component;
    };
    protected listeners: Listener<any>[];
    protected l: Listener<any>[];
    protected id: string;
    protected router: Router;
    constructor(tagName: string);
    getId(): string;
    setRouter(router: Router): void;
    getRouter(): Router;
    protected setHTML(html: string, source?: Component | {
        [index: string]: any;
    }): void;
    protected clearHTML(): void;
    release(): void;
    attach(attachPoint: HTMLElement | string, replace?: boolean): void;
    forEachAttachments(cb: ForEachCb): void;
    getAttachment<T extends HTMLElement>(name: string): T;
    createComponent<A extends Component>(c: new () => A, name?: string): A;
    getComponent<T extends Component>(name: string): T;
    clearComponents(): void;
    destroyComponent(identifier: string | Component): void;
    forEachComponents(cb: ForEachCb): void;
    addServiceListener<B>(service: Service, event: string, cb: ListenerCallback<B>): Listener<B>;
    addListener(element: HTMLElement | Window, event: string, cb: any): Listener<Event>;
    removeListener(target: Listener<any>): void;
    remove<T>(elements: T[], element: T): void;
}

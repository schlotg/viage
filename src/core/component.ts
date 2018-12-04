import { Service } from '../core/service';
import { Listener, ListenerCallback } from '../core/listener';
import { Router } from '../core/router';

export type ForEachCb = (e: any) => void;

export class Component {

  public e: HTMLElement;
  protected attachments: {[index: string]: HTMLElement} = {};
  protected components: {[index: string]: Component} = {};
  protected listeners: Listener<any>[] = [];
  static counter = 0;
  protected id: number;
  protected router: Router;

  constructor(tagName: string) {
    this.e = document.createElement(tagName);
    this.id = Component.counter;
    Component.counter += 1;
  }

  getId() : number {
    return this.id;
  }

  // set the router. Set by a Router when constructing or when creating components
  setRouter(router: Router) {
    this.router = router;
  }

  getRouter() {
    return this.router;
  }

  // set HTML and extract attachments. If source is set, evaluate as a template string against the source
  protected setHTML(html: string, source?: Component | {[index: string]: any}) {
    function evaluate(str: string) {
      let result = '';
      try { result =  eval(`\`${str}\``) }
      catch(e) { console.error('Error trying to evalaute in setHTML', e) }
      return result;
    }
    this.e.innerHTML = (source) ? evaluate.call(source, html) : html;
    this.attachments = {};
    const attachments = this.e.querySelectorAll('[attach]');
    for (let i = 0; i < attachments.length; ++i){
      const attachment = attachments[i] as HTMLElement;
      this.attachments[attachment.getAttribute('attach')] = attachment;
    }
  }

  // clear the html and attachments
  protected clearHTML() {
    this.e.innerHTML = '';
    this.attachments = {};
  }

  // release everything and call destroy if its defined
  release() {
    // clean up service listeners
    this.listeners.forEach((l: Listener<any>) => this.removeListener(l));
    // clean up components
    this.clearComponents();
    // cleanup attachments and innerHTML
    this.clearHTML();
    // destroy references to our HTML element
    this.e = null;
    // call destroy() if defined
    const temp = this as any;
    if (temp.destroy) {
      temp.destroy();
    }
    this.router = null;
  }


  // attach this component to an HTML Element
  attach(attachPoint: HTMLElement | string, replace?: boolean) {
    const e = (typeof attachPoint === 'string') ? document.querySelector(attachPoint) : attachPoint;
    if (e) {
      if (replace) {
        e.innerHTML = '';
      }
      e.appendChild(this.e);
    }
  }

  forEachAttachments(cb: ForEachCb) {
    const attachments = this.attachments;
    Object.keys(attachments).forEach(k => cb(attachments[k]));
  }

  // get an Attachment by name, return as a typed object
  getAttachment<T extends HTMLElement>(name: string): T {
    return <T>this.attachments[name];
  }

  // create a component
  createComponent<A extends Component>(c: new () => A, name?: string): A {
    const instance = new c();
    this.components[name || instance.getId().toString()] = instance;
    instance.setRouter(this.router);
    return instance;
  }

  // get a Component by name, return as a typed object
  getComponent<T extends Component>(name: string): T {
    return this.components[name] as T;
  }

  clearComponents() {
    Object.keys(this.components).forEach( k => this.destroyComponent(k));
    this.components = {};
  }

  // destroy a component by either string or component
  destroyComponent(identifier: string | Component) {
    const components = this.components;
    if (typeof identifier === 'string') {
      const component = components[identifier];
      if (component) {
        component.release();
        delete components[identifier];
      }
    } else if (identifier instanceof Component) {
      for(let k in components) {
        const component = components[k];
        if (component.getId() == identifier.getId()) {
          component.release();
          delete components[k];
          break;
        }
      }
    }
  }

  forEachComponents(cb: ForEachCb) {
    const components = this.components;
    Object.keys(components).forEach(k => cb(components[k]));
  }

  // add a Listener to a service
  addServiceListener<B>(service: Service, event: string, cb: ListenerCallback<B>): Listener<B> {
    const listener = service.addEventListener(event, cb);
    this.listeners.push(listener);
    return listener;
  }

  // remove a listener
  removeListener(target: Listener<any>) {
    if (target) {
      target.remove();
      const id = target.getId();
      this.listeners.every((l, i) => {
        let next = true;
        if (l.getId() === id) {
          this.listeners.splice(i, 1);
          next = false;
        }
        return next;
      });
    }
  }
}
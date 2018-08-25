import { Service } from '../core/service';
import { Listener } from '../core/listener';
import { Router } from '../core/router';

export type forEachCB = (e: any) => void;

export class Component {

  public e: HTMLElement;
  protected attachments: any = {};
  protected components: any = {};
  protected listeners: Listener[] = [];
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

  // set HTML and extract attachments
  protected setHTML(html: string) {
    this.e.innerHTML = html;
    this.attachments = {};
    const attachments = this.e.querySelectorAll('[attach]');
    for (let i = 0; i < attachments.length; ++i){
      const attachment = attachments[i];
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
    this.listeners.forEach((l: Listener) => this.removeListener(l));
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

  forEachAttachments(cb: forEachCB) {
    const attachments = this.attachments;
    Object.keys(attachments).forEach(k => cb(attachments[k]));
  }

  // create a component
  createComponent<A extends Component>(c: new () => A, name?: string): A {
    const instance = new c();
    this.components[name || instance.getId().toString()] = instance;
    instance.setRouter(this.router);
    return instance;
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

  forEachComponents(cb: forEachCB) {
    const components = this.components;
    Object.keys(components).forEach(k => cb(components[k]));
  }

  // add a Listener to a service
  addServiceListener<A extends Service>(service: A, event: string, cb: any): Listener {
    const listener = service.addEventListener(event, cb);
    this.listeners.push(listener);
    return listener;
  }

  // remove a listener
  removeListener(target: Listener) {
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
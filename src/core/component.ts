import { Service } from '../core/service';
import { Listener } from '../core/listener';

export type forEachCB = (e: any) => void;

export class Component {

  public e: HTMLElement;
  protected attachments: any = {};
  protected components: any = {};
  protected serviceListeners: Listener[] = [];
  static id = 0;

  constructor(tagName: string) {
    this.e = document.createElement(tagName);
  }

  protected getId() {
    return Component.id += 1;
  }

  protected setHTML(html: string){
    this.e.innerHTML = html;
    const attachments = this.e.querySelectorAll('[attach]');
    for (let i = 0; i < attachments.length; ++i){
      const attachment = attachments[i];
      this.attachments[attachment.getAttribute('attach')] = attachment;
    }
  }

  release() {
    // clean up service listeners
    this.serviceListeners.forEach((l: Listener) => l.remove());
    // clean up components
    const components = this.components;
    const keys = Object.keys(this.components);
    keys.forEach((k) => {
      const component = components[k];
      component.release();
      if(component.destroy){
        component.destroy();
      }
    });
    this.attachments = {};
    this.components = {};
    this.e = null;
    const temp = this as any;
    if (temp.destroy) {
      temp.destroy();
    }
  }

  attach(attachPoint: HTMLElement | string, replace?: boolean) {
    const e = (typeof attachPoint === 'string') ? document.querySelector(attachPoint) : attachPoint;
    if (e) {
      if (replace) {
        e.innerHTML = '';
      }
      e.appendChild(this.e);
    }
  }

  // destroy a component
  destroyComponent(name: string) {
    const component = this.components[name];
    if (component) {
      component.release();
      if (component.destroy) {
        component.destroy();
      }
      delete this.components[name];
    }
  }

  // create a component
  createComponent<A extends Component>(c: new () => A, name?: string): A {
    const instance = new c();
    this.components[name || this.getId()] = instance;
    return instance;
  }

  // add a Listener to a service
  addServiceListener<A extends Service>(service: A, event: string, cb: any) {
    this.serviceListeners.push(service.addEventListener(event, cb));
  }

  clearComponents() {
    this.components = {};
  }

  forEachAttachments(cb: forEachCB) {
    const attachments = this.attachments || {};
    for(let k in attachments) {
      const attachment = attachments[k];
      cb(attachment);
    }
  }

  forEachComponents(cb: forEachCB) {
    const components = this.components || {};
    for(let k in components) {
      const component = components[k];
      cb(component);
    }
  }

}
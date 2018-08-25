import { Listener } from './listener';

export class Service {
  protected e = document.createElement('service');

  addEventListener(event: string, cb: any) : Listener {
    return new Listener(this.e, event, cb);
  }

  dispatchEvent(_event: string, data: any) {
    const event = new CustomEvent(_event, { detail: data });
    this.e.dispatchEvent(event);
  }
}
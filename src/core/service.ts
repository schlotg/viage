import { Listener, ListenerCallback } from './listener';

export class Service {
  protected e = document.createElement('service');

  addEventListener<T>(event: string, cb: ListenerCallback<T>) : Listener<T> {
    return new Listener<T>(this.e, event, cb);
  }

  dispatchEvent<T>(_event: string, data: T) {
    const event = new CustomEvent(_event, { detail: data });
    this.e.dispatchEvent(event);
  }
}
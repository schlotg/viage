export interface ListenerCallback<T> {
  (data: T): void;
};

export class Listener<T> {
  protected cb: any;
  protected e: HTMLElement | Window;
  protected event: string;
  protected static counter = 0;
  protected id: number;
  constructor (element: HTMLElement | Window, event: string, cb: ListenerCallback<T>) {
    this.cb = (e: CustomEvent) => cb(<T>e.detail);
    this.e = element;
    this.event = event;
    this.e.addEventListener(event, this.cb);
    Listener.counter += 1;
    this.id = Listener.counter;
  }
  remove() {
    if (this.e) {
      this.e.removeEventListener(this.event, this.cb);
      this.e = null;
      this.cb = null;
    }
  }
  isRemoved(): boolean {
    return !this.e;
  }
  getId(): number {
    return this.id;
  }
}
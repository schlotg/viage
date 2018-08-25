export class Listener {
  protected cb: any;
  protected e: HTMLElement;
  protected event: string;
  protected static counter = 0;
  protected id: number;
  constructor (e: any, event: string, cb: any) {
    this.cb = cb;
    this.e = e as HTMLElement;
    this.event = event;
    this.e.addEventListener(event, cb);
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
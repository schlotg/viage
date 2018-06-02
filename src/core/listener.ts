export class Listener {
  private cb: any;
  private e: HTMLElement;
  private event: string;
  constructor (e: any, event: string, cb: any) {
    this.cb = cb;
    this.e = e as HTMLElement;
    this.event = event;
    this.e.addEventListener(event, cb);
  }
  remove() {
    if (this.e) {
      this.e.removeEventListener(this.event, this.cb);
      this.e = null;
      this.cb = null;
    }
  }
}
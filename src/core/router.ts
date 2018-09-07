import { Component } from './component';
import { Listener } from './Listener';

export interface State {
  name: string;
  component: any;
  type: 'DEFAULT' | 'NORMAL';
}

export type StateChangedCallback = (stateInfo: StateInfo) => Promise<void>;

export interface StateInfo {
  name: string;
  data: any;
  url: string;
}

class InternalState {
  name: string;
  component: any;
  data: any;
  url: string;
  componentInstance?: any;
}

export class Router {

  protected portal: HTMLElement;
  protected states: { [index: string]: State } = {};
  protected currentState: InternalState;
  protected type: 'HASH' | 'LOCATION' | 'STANDALONE';
  protected history: string[] = [];
  protected defaultState: State;
  protected listener: Listener;
  protected name: string;
  protected stateChangedCallback: StateChangedCallback;

  constructor(portal: HTMLElement, type: 'HASH' | 'LOCATION' | 'STANDALONE', name: string) {
    this.portal = portal;
    this.type = type;
    this.name = name;
    if (type === 'HASH') {
      this.listener = new Listener(window, 'popstate', (e: PopStateEvent) => this.go(location.href));
    }
  }

  release () {
    this.listener && this.listener.remove();
    this.states = {};
    this.history = [];
    this.portal = undefined;
  }

  // decode a URL coming in
  // the are in the form '#?s=<state>;d=<data>;
  protected decodeUrl (url: string): StateInfo {
    const start = url.indexOf('?') + 1;
    if (start) {
      const str = url.slice(start);
      const parts = str.split(';');
      if (parts.length) {
        const stateParts = parts[0].split('=') || [];
        const dataParts = (parts[1] && parts[1].split('=')) || [];
        const name = stateParts[1] ? decodeURIComponent(stateParts[1]) : '';
        const data = dataParts[1] ? JSON.parse(decodeURIComponent(dataParts[1])) : {};
        return { name, data, url };
      }
    }
    return {} as StateInfo;
  }

  protected activateState(state: InternalState) {
    const currentState = this.currentState || {} as InternalState;
    if (currentState.url !== state.url) {
      // clear out the old state
      this.portal.innerHTML = '';
      if (currentState.componentInstance) {
        currentState.componentInstance.release();
        currentState.componentInstance = null;
      }
      // create the new state
      const component: Component = new state.component();
      component.setRouter(this);
      component.attach(this.portal);
      // call init on the component if it exists
      const _component = component as any;
      if (_component.init) {
        _component.init(state.data);
      }
      state.componentInstance = component;
      // set the current state
      this.currentState = state;
      if (this.type === 'STANDALONE') {
        this.history.push(state.url);
      }
    }
  }

  protected error(msg: string, url: string) {
    console.error(msg);
    this.portal.innerHTML = msg;
    const currentState = this.currentState || {} as InternalState;
    if (currentState.componentInstance) {
      currentState.componentInstance.release();
      currentState.componentInstance = null;
    }
    this.currentState = {url, name: 'Error' } as InternalState;
    if (this.type === 'STANDALONE') {
      this.history.push(url);
    }
  }

  getName() {
    return this.name;
  }

  getType() {
    return this.type;
  }

  addStates(states: State[]) {
    states.forEach((state: State) => {
      this.states[state.name] = state;
      if (state.type === 'DEFAULT') {
        this.defaultState = state;
      }
    });
  }

  removeState(name: string) {
    if (name && this.states[name]) {
      delete this.states[name];
      this.defaultState = (this.defaultState.name === name) ? null : this.defaultState;
    }
  }

  clearStates() {
    this.states = {};
    this.defaultState = null;
  }

  start() {
    if (this.type !== 'STANDALONE') {
      this.go(location.href);
    } else if (this.defaultState) {
      const url = this.createUrl(this.defaultState.name);
      this.go(url);
    }
  }

  createUrl<T>(state: string, data?: T){
    let escState = encodeURIComponent(state);
    let escData = encodeURIComponent(JSON.stringify(data));
    let url = (this.type === 'HASH') ? `#?s=${escState};` : `?s=${escState};`;
    url += (data) ? `d=${escData};` : '';
    return url;
  }

  protected _go(url: string, internalState: InternalState) {
    this.activateState(internalState);
    if (this.type !== 'STANDALONE') {
      const current = location.href;
      // only assign this to location if it is not already there
      if (current.indexOf(url) === -1) {
        location.href = url;
      }
    }
  }

  clearStateChangedCallback() {
    this.stateChangedCallback = null;
  }

  setStateChangedCallback(cb: StateChangedCallback) {
    this.stateChangedCallback = cb;
  }

  go(url: string): boolean {
    if (!this.currentState || url.indexOf(this.currentState.url) === -1) {
      let stateInfo = this.decodeUrl(url);
      let state = this.states[stateInfo.name];
      if (!state) { console.warn(`Viage Router: State not found. State:${stateInfo.name} Url:${url}`); }
      if (!state && !this.defaultState) {
        this.error(`Viage Router: State not found for url${url} and no Default State configured`, url);
      } else {
        state = state || this.defaultState;
        let internalState = { name: state.name, component: state.component, data: stateInfo.data, url };
        // give the oppertunity to do animations before the the state
        // change actually happens
        if (this.stateChangedCallback) {
          this.stateChangedCallback(stateInfo).then(() => this._go(url, internalState));
        } else {
          this._go(url, internalState);
        }
        return true;
      }
    }
    return false;
  }

  back() {
    if (this.type !== 'STANDALONE') {
      history.back();
    } else {
      this.history.pop();
      const next = this.history.length ? this.history.length - 1 : 0;
      this.go(this.history[next]);
    }
  }
}

const routers: {[index: string]: Router} = {};
let locationOrHash = false;

export function getRouter(name: string) {
  return routers[name];
}

// create a router, pass in the portal as an element or by selector string
export function createRouter(name: string, portal: HTMLElement | string, type: 'LOCATION' | 'HASH' | 'STANDALONE') {
  if (!routers[name]) {
    if (locationOrHash && (type === 'HASH' || type === 'LOCATION')) {
      console.error('Viage Router: Only one HASH or LOCATION Router can exist at a time');
    } else {
      locationOrHash = (type === 'HASH' || type === 'LOCATION');
      const e = (typeof portal === 'string') ? document.querySelector(portal) as HTMLElement: portal;
      routers[name] = new Router(e, type, name);
    }
  } else {
    console.error(`Viage Router: Router with Name: ${name} already exists`);
  }
  return routers[name];
}

// destroy a router
export function destroyRouter(name: string) {
  if (routers[name]) {
    const router = routers[name];
    const type = router.getType();
    if (type === 'HASH' || type === 'LOCATION') {
      locationOrHash = false;
    }
    router.release();
    delete routers[name];
  }
}

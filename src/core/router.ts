import { Component } from './component';
import { Listener } from './listener';

export interface State<T extends Component> {
  name: string;
  component?: T;
  promise?: any;
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
  component?: any;
  promise?: any;
  data: any;
  url: string;
  componentInstance?: any;
}

export class Router {

  protected portal: HTMLElement;
  protected states: { [index: string]: State<any> } = {};
  protected currentState: InternalState;
  protected type: 'HASH' | 'LOCATION' | 'STANDALONE';
  protected history: string[] = [];
  protected defaultState: State<any>;
  protected listener: Listener<any>;
  protected name: string;
  protected stateChangedCallback: StateChangedCallback;
  protected starting = false;

  constructor(portal: HTMLElement, type: 'HASH' | 'LOCATION' | 'STANDALONE', name: string) {
    this.portal = portal;
    this.type = type;
    this.name = name;
    if (type === 'HASH') {
      this.listener = new Listener<any>(window, 'popstate', (e: PopStateEvent) => this.go(location.href));
    }
  }

  release () {
    this.listener && this.listener.remove();
    this.states = {};
    this.history = [];
    this.portal = undefined;
  }

  // decode a URL coming in
  // the are in the form '#<state>;<data> or ?<state>;<data>
  protected decodeUrl (url: string): StateInfo {
    const start = (this.type === 'HASH') ? url.indexOf('#') + 2 : url.indexOf('?') + 2 ;
    if (start) {
      const str = url.slice(start);
      const parts = str.split(';');
      if (parts.length) {
        let name, data;
        try {
          name = parts[0] ? decodeURIComponent(parts[0]) : '';
          data = parts[1] ? JSON.parse(decodeURIComponent(parts[1])) : {};
        } catch(e) {
          console.error('Viage:Router.decodeUrl(): Error decoding URL:', url);
          name = data = null;
        }
        return { name, data, url };
      }
    }
    return {} as StateInfo;
  }

  protected activateState(state: InternalState) {
    return new Promise ((resolve, reject) => {
      const currentState = this.currentState || {} as InternalState;
      if (currentState.url !== state.url) {
        // clear out the old state
        this.portal.innerHTML = '';
        if (currentState.componentInstance) {
          currentState.componentInstance.release();
          currentState.componentInstance = null;
        }
        // If a state then create one
        if (state.component) {
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
          resolve();
        // else if a function then call it and wait on the promise
        } else {
          state.promise().then((component: Component) => {
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
            resolve();
          });
        }
      } else {
        resolve();
      }
  });
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

  addStates(states: State<any>[]) {
    states.forEach((state: State<any>) => {
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
      this.starting = true;
      this.go(location.href);
    } else if (this.defaultState) {
      const url = this.createUrl(this.defaultState.name);
      this.go(url);
    }
    this.starting = false;
  }

  createUrl<T>(state: string, data?: T) {
    let escState, json, escData;
    try {
      escState = encodeURIComponent(state);
      json = JSON.stringify(data);
      escData = encodeURIComponent(json);
    } catch (e) {
      console.error('Viage:Router.createURL(): Error creating URL:', state, data);
      json = null;
      escData = null;
      escState = this.defaultState && this.defaultState.name || '';
    }
    let url = (this.type === 'HASH') ? `#/${escState}` : `?/${escState}`;
    url += (data && json !== '{}' && json !== '[]' && json !== 'undefined' && json !== 'null') ? `;${escData}` : '';
    return url;
  }

  protected _go(url: string, internalState: InternalState) {
    this.activateState(internalState).then(() => {
      if (this.type !== 'STANDALONE') {
        const current = location.href;
        // only assign this to location if it is not already there
        const currentLocation = current.substring(current.indexOf(url));
        if (currentLocation !== url) {
          location.href = url;
        }
      }
    });
  }

  protected strip(url: string) {
    const i = url.indexOf('://');
    const start = (i > 0) ? url.indexOf('/', i + 3) + 1 : 0;
    return url.substring(start);
  }

  clearStateChangedCallback() {
    this.stateChangedCallback = null;
  }

  setStateChangedCallback(cb: StateChangedCallback) {
    this.stateChangedCallback = cb;
  }

  go(url: string): boolean {
    // only do something we havent been set yet or if we are going to somewhere new
    if (!this.currentState || this.strip(url) !== this.currentState.url) {
      //url.indexOf(this.currentState.url) === -1) {
      let stateInfo = this.decodeUrl(url);
      let state = this.states[stateInfo.name];
      if (!state) { console.warn(`Viage Router: State not found. State:${stateInfo.name} Url:${url}`); }
      if (!state && !this.defaultState) {
        this.error(`Viage Router: State not found for url${url} and no Default State configured`, url);
      } else {
        state = state || this.defaultState;
        const newUrl = this.createUrl(state.name, stateInfo.data);
        const href = location.href;
        const oldUrl = href.slice(href.indexOf(this.type === 'HASH' ? '#' : '?'));
        let internalState = { name: state.name, component: state.component, promise: state.promise, data: stateInfo.data, url: newUrl };
        // if we are starting and the url needs to be changed just change it
        if (this.starting && this.type === 'LOCATION' && oldUrl !== newUrl) {
          location.href = newUrl;
        // else if we have a different url or we are starting apply the new state
        } else {
          if (this.stateChangedCallback) {
            this.stateChangedCallback(stateInfo).then(() => this._go(newUrl, internalState));
          } else {
            this._go(newUrl, internalState);
          }
        }
        return true;
      }
    }
    return false;
  }

  goDirect<T>(state: string, data?: T) {
    this.go(this.createUrl<T>(state, data));
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

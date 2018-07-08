import { Component } from './component';

export interface State {
  name: string;
  component: any;
  paramsList: string[];
}

class InternalState {
  name: string;
  component: any;
  paramsList: string[];
  params: any;
  url: string;

  constructor(state: State, params: any, url: string, component: any) {
    this.name = state.name;
    this.component = component;
    this.paramsList = this.paramsList;
    this.params = params;
  }
}

export class Router {

  private portal: HTMLDivElement;
  private states: State[] = [];
  private currentState: InternalState;
  private hookUrl = false;
  private history: string[] = [];
  private defaultState: string;
  private currentUrl: string;

  constructor(portal: HTMLDivElement, hookUrl: boolean) {
    this.portal = portal;
    this.hookUrl = hookUrl;
    if(hookUrl) {
      //window.addEventListener('hashchange', () => {/*this._go(location.href);*/ console.log('here1'); });
      window.addEventListener('popstate', (e) => {
        this._go(location.href);
      });
    }
  }

  addStates(states: State[]) {
    this.states = states;
  }

  addState(state: State) {
    this.states.push(state);
  }

  removeState(name: string) {
    const i = this.states.findIndex((state) => state.name === name);
    if(i !== -1) {
      this.states.splice(i, 1);
    }
  }

  setDefaultState(url: string){
    this.defaultState = url;
    //this.go(url);
  }

  go(_url?: string) {
    let url = _url || this.defaultState;
    if (!this.currentUrl) {
      url = (this.isValidState(_url)) ? _url : this.defaultState;
    }
    if (this.currentUrl !== url){
      this.history.push(url);
      this._go(url);
    }
  }

  back() {
    if (this.history.length) {
      this.history.pop();
      this.hookUrl
      const url = this.history[this.history.length - 1];
      this._go(url || this.defaultState);
    } else if (this.defaultState) {
      this._go(this.defaultState);
    }
  }

  private isValidState(url: string) {
    const result = this.stripOutHash(url);
    const state = this.states.find((state) => state.name === result.hash);
    return !!state;
  }

  private stripOutHash(url: string) {
    const hashStart = url.indexOf('#');
    let hashEnd = url.indexOf('/', hashStart);
    hashEnd = (hashEnd < 0) ? url.length : hashEnd;
    const hash = url.slice(hashStart, hashEnd).replace('#', '');
    return { hash: hash, hashEnd: hashEnd };
  }

  private _go(url: string) {
    const result = this.stripOutHash(url);
    const state = this.states.find((state) => state.name === result.hash);
    if (state) {
      const params = url.slice(result.hashEnd + 1, url.length);
      this.setState(state, params, url);
    }
  }

  private setState(state: State, _params: any, url: string) {
    const currentState = this.currentState || {} as State;
    if (this.currentUrl !== url) {
      this.currentUrl = url;
      location.href = url;
      this.portal.innerHTML = '';
      if (currentState.component) {
        currentState.component.release();
      }
      const params = (typeof _params === 'string') ? this.parseParams(state, _params) : _params;
      const component: Component = new state.component(params);
      component.attach(this.portal);
      const internalState = new InternalState(state, params, url, component);
      this.currentState = internalState;
    }
  }

  private parseParams(state: State, params: string) {
    const result: any = {};
    params = params || '';
    let paramIndex = 0, stringIndex = 0;
    while (stringIndex < params.length) {
      let end = params.indexOf('/', stringIndex);
      end = (end > 0) ? end : params.length;
      const value = params.slice(stringIndex, end);
      result[state.paramsList[paramIndex]] = value;
      stringIndex += end;
    }
    return result;
  }
}

const routers: {[index: string]: Router} = {};

export function getRouter(name: string) {
  return routers[name];
}

export function createRouter(name: string, portal: HTMLDivElement, hookUrl?: boolean) {
  if(!routers[name]) {
    routers[name] = new Router(portal, hookUrl);
  }
  return routers[name];
}

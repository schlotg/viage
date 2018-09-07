import { Router, createRouter, getRouter, State, destroyRouter, StateInfo } from '../src/core/router';
import { Component } from '../src/core/component';

class InternalState {
  name: string;
  component: any;
  data: any;
  url: string;
  componentInstance?: any;
}

let e: HTMLElement;

// // Derive off of Router so we can access functions and test properly
class TestRouter extends Router {

  constructor (type?: 'HASH' | 'LOCATION' | 'STANDALONE' ) {
    super(e, type || 'STANDALONE', 'Test');
  }
  isReleased() {
    return !this.portal;
  }
  testDecodeUrl(url: string) {
    return this.decodeUrl(url);
  }
  testActivateState (state: InternalState) {
    this.activateState(state);
  }
  setCurrentState (state: InternalState) {
    this.currentState = state;
  }
  getCurrentState() {
    return this.currentState;
  }
  getHistory() {
    return this.history;
  }
  testError(msg: string, url: string) {
    this.error(msg, url);
  }
  getStates() {
    return this.states;
  }
  getDefaultState() {
    return this.defaultState;
  }
  setHistory(url: string) {
    this.history.push(url);
  }
  _go(url: string, internalState: InternalState) {
    super._go(url, internalState);
  }
  getStateChangedCallback () {
    return this.stateChangedCallback;
  }
}

class TestComponent extends Component {
    data: any;
    constructor (data: any) {
     super ('test-component');
     this.data = data;
    }
    release() {}
}

beforeAll(() => {
  const portal = document.createElement('div');
  document.body.appendChild(portal);
  e = portal;
  e.className ='test';
});

test('Should create a Router by name', () => {
  const router: Router = createRouter('Test', e, 'STANDALONE');
  expect(router.getName()).toBe('Test');
  destroyRouter('Test');
});


test('Should get a Router by name', () => {
  createRouter('Test', e, 'STANDALONE');
  const router: Router = getRouter('Test');
  expect(router.getName()).toBe('Test');
  destroyRouter('Test');
});

test('Should release Router', () => {
  const router: TestRouter = new TestRouter();
  router.release();
  expect(router.isReleased()).toBe(true);
});

test('Should release Router and remove from routers list', () => {
  createRouter('Test', e, 'STANDALONE');
  destroyRouter('Test');
  expect(getRouter('Test')).toBe(undefined);
});

test('Should error if two routers of the same name are created', () => {
  const mock = jest.spyOn(console, "error");
  mock.mockImplementation(() => "");
  createRouter('Test', e, 'STANDALONE');
  createRouter('Test', e, 'STANDALONE');
  expect(mock).toHaveBeenCalledWith('Viage Router: Router with Name: Test already exists');
  mock.mockRestore();
  destroyRouter('Test');
});

test('Should error if a location router or a Hash router are created', () => {
  const mock = jest.spyOn(console, "error");
  mock.mockImplementation(() => "");
  createRouter('Test', e, 'HASH');
  createRouter('Test2', e, 'LOCATION');
  expect(mock).toHaveBeenCalledWith('Viage Router: Only one HASH or LOCATION Router can exist at a time');
  mock.mockRestore();
  destroyRouter('Test');
  destroyRouter('Test2');
});

test('Should not error if a Standlaone router or a Hash router are created', () => {
  const mock = jest.spyOn(console, "error");
  mock.mockImplementation(() => "");
  createRouter('Test', e, 'HASH');
  createRouter('Test2', e, 'STANDALONE');
  expect(mock).not.toHaveBeenCalledWith('Viage Router: Only one HASH or LOCATION Router can exist at a time');
  mock.mockRestore();
  destroyRouter('Test');
  destroyRouter('Test2');
});

test('Should decode a URL properly', () => {
  const router = new TestRouter();
  const name = 'test/state';
  const data = { pi: 3.14159, foo: 'bar'};
  const result = router.testDecodeUrl(`http://test.com?s=${encodeURIComponent(name)};d=${encodeURIComponent(JSON.stringify(data))};`);
  expect(result.name).toEqual(name);
  expect(result.data).toEqual(data);
  router.release();
});

test('Should create a URL properly', () => {
  const router = new TestRouter();
  const name = 'test/state';
  const data = { pi: 3.14159, foo: 'bar'};
  const url = router.createUrl(name, data);
  const result = router.testDecodeUrl(url);
  expect(result.name).toEqual(name);
  expect(result.data).toEqual(data);
  router.release();
});

test('Should create and decode a URL properly with no data', () => {
  const router = new TestRouter();
  const name = 'test/state';
  let data;
  const url = router.createUrl(name, data);
  const result = router.testDecodeUrl(url);
  expect(result.name).toEqual(name);
  expect(result.data).toEqual({});
  router.release();
});

test('Should create and decode a URL properly with empty data', () => {
  const router = new TestRouter();
  const name = 'test/state';
  let data = {};
  const url = router.createUrl(name, data);
  const result = router.testDecodeUrl(url);
  expect(result.name).toEqual(name);
  expect(result.data).toEqual(data);
  router.release();
});

test('activateState should clear and release the previous component', () => {
  const router = new TestRouter();
  const prevComponent = new TestComponent({});
  e.innerHTML = 'Hello World';
  const currentState: InternalState = {
    name:'testState',
    component: prevComponent,
    componentInstance: prevComponent,
    data:{},
    url: ''
  };
  router.setCurrentState(currentState);
  const mockComponent = jest.spyOn(prevComponent, 'release');
  router.testActivateState({ name: 'testState2', component: TestComponent, data:{}, url: '2' });
  expect(e.innerHTML).toEqual('<test-component></test-component>');
  expect(mockComponent).toBeCalled();
  router.release();
  mockComponent.mockRestore();
});

test('activateState should do nothing if urls are the same', () => {
  const router = new TestRouter();
  const prevComponent = new TestComponent({});
  e.innerHTML = 'Hello World';
  const currentState: InternalState = {
    name:'testState',
    component: prevComponent,
    componentInstance: prevComponent,
    data:{},
    url: ''
  };
  router.setCurrentState(currentState);
  const mockComponent = jest.spyOn(prevComponent, 'release');
  router.testActivateState({ name: 'testState2', component: TestComponent, data:{}, url: '' });
  expect(e.innerHTML).toEqual('Hello World');
  expect(mockComponent).not.toBeCalled();
  router.release();
  mockComponent.mockRestore();
});

test('activateState should pass data to the new component and increment history', () => {
  const router = new TestRouter();
  e.innerHTML = 'Hello World';
  const data = { foo: 'bar' };
  router.testActivateState({ name: 'testState2', component: TestComponent, data, url: '' });
  const currentState = router.getCurrentState();
  expect(currentState.data).toEqual(data);
  expect(router.getHistory().length).toBe(1);
  router.release();
});

test('activateState should not increment history for non-standalone', () => {
  const router = new TestRouter('HASH');
  e.innerHTML = 'Hello World';
  const data = { foo: 'bar' };
  router.testActivateState({ name: 'testState2', component: TestComponent, data, url: '' });
  expect(router.getHistory().length).toBe(0);
  router.release();
});

test('error should set the error msg in the portal, release previous component, output error message, and increment history', () => {
  const router = new TestRouter();
  e.innerHTML = 'Hello World';
  const msg = 'Test Error Msg';
  const prevComponent = new TestComponent({});
  const currentState: InternalState = {
    name:'testState',
    component: prevComponent,
    componentInstance: prevComponent,
    data:{},
    url: ''
  };
  const mock = jest.spyOn(console, "error");
  mock.mockImplementation(() => "");
  router.setCurrentState(currentState);
  const mockComponent = jest.spyOn(prevComponent, 'release');
  router.testError(msg, '');
  expect(mock).toBeCalled();
  expect(mockComponent).toBeCalled();
  expect(e.innerHTML).toEqual(msg);
  expect(router.getHistory().length).toBe(1);
  mockComponent.mockRestore();
  mock.mockRestore();
  router.release();
});

test('error should not increment history for no standalone router', () => {
  const router = new TestRouter('LOCATION');
  e.innerHTML = 'Hello World';
  const msg = 'Test Error Msg';
  const prevComponent = new TestComponent({});
  const currentState: InternalState = {
    name:'testState',
    component: prevComponent,
    componentInstance: prevComponent,
    data:{},
    url: ''
  };
  const mock = jest.spyOn(console, "error");
  mock.mockImplementation(() => "");
  router.setCurrentState(currentState);
  const mockComponent = jest.spyOn(prevComponent, 'release');
  router.testError(msg, '');
  expect(mock).toBeCalled();
  expect(mockComponent).toBeCalled();
  expect(e.innerHTML).toEqual(msg);
  expect(router.getHistory().length).toBe(0);
  mockComponent.mockRestore();
  mock.mockRestore();
  router.release();
});

test('name and type should get set properly', () => {
  const router = new TestRouter();
  expect(router.getName()).toBe('Test');
  expect(router.getType()).toBe('STANDALONE');
  router.release();
});

test('Should correctly add states and set the default state', () => {
  const router = new TestRouter();
  const states: State[] = [
    {name: 'state1', component: TestComponent, type: 'DEFAULT' },
    {name: 'state2', component: TestComponent, type: 'NORMAL' },
  ];
  const resultStates: any = {};
  states.forEach((state) => resultStates[state.name] = state);
  router.addStates(states);
  expect(router.getStates()).toEqual(resultStates);
  expect(router.getDefaultState()).toEqual(states[0]);
  router.release();
});

test('Should remove the correct state', () => {
  const router = new TestRouter();
  const states: State[] = [
    {name: 'state1', component: TestComponent, type: 'DEFAULT' },
    {name: 'state2', component: TestComponent, type: 'NORMAL' },
  ];
  const resultStates: any = {};
  states.forEach((state) => resultStates[state.name] = state);
  router.addStates(states);
  router.removeState('state2');
  delete resultStates['state2'];
  expect(router.getStates()).toEqual(resultStates);
  router.release();
});

test('start() should go to the location in href', () => {
  const router = new TestRouter('HASH');
  const mock = jest.spyOn(router, "go");
  mock.mockImplementation(() => '');
  router.start();
  expect(mock).toBeCalled();
  router.release();
  mock.mockRestore();
});

test('start() should not go to the location in href for standalone router', () => {
  const router = new TestRouter();
  const mock = jest.spyOn(router, "go");
  mock.mockImplementation(() => '');
  router.start();
  expect(mock).not.toBeCalled();
  router.release();
  mock.mockRestore();
});

test('go() should not do anything if the url is the same', () => {
  const router = new TestRouter();
  const url = 'test';
  router.setCurrentState({ url } as InternalState);
  expect(router.go(url)).toBe(false);
});

test('go() should error and warn when no states are defined', () => {
  const router = new TestRouter();
  const url = 'test';
  const error = jest.spyOn(console, 'error');
  error.mockImplementation(() => '');
  const warn = jest.spyOn(console, 'warn');
  warn.mockImplementation(() => '');
  expect(router.go(url)).toBe(false);
  expect(error).toBeCalled();
  expect(warn).toBeCalled();
  error.mockRestore();
  warn.mockRestore();
  router.release();
});

test('go() should try to activate a valid state', () => {
  const router = new TestRouter();
  const states: State[] = [
    {name: 'state1', component: TestComponent, type: 'DEFAULT' },
    {name: 'state2', component: TestComponent, type: 'NORMAL' },
  ];
  const url = router.createUrl('state1', {});
  router.addStates(states);
  expect(router.go(url)).toBe(true);
  expect(location.href).not.toContain(url);
  router.release();
});

test('go() should try to activate a valid state and set location.href', () => {
  const router = new TestRouter('HASH');
  const states: State[] = [
    {name: 'state1', component: TestComponent, type: 'DEFAULT' },
    {name: 'state2', component: TestComponent, type: 'NORMAL' },
  ];
  const url = router.createUrl('state1', {});
  router.addStates(states);
  expect(router.go(url)).toBe(true);
  expect(location.href).toContain(url);
  router.release();
});

test('back() should call history.back() if not a STANDALONE router', () => {
  const router = new TestRouter('HASH');
  const mock = jest.spyOn(history, 'back');
  mock.mockImplementation(() => '');
  router.back();
  expect(mock).toBeCalled();
  mock.mockRestore();
  router.release();
});

test('back() should call pop last history entry and call go if STANDALONE router', () => {
  const router = new TestRouter('STANDALONE');
  const mockGo = jest.spyOn(router, 'go');
  let destUrl;
  const pushUrl = 'test';
  router.setHistory(pushUrl);
  router.setHistory('testPrev');
  mockGo.mockImplementation((url) => destUrl = url);
  router.back();
  expect(destUrl).toEqual(pushUrl);
  mockGo.mockRestore();
  router.release();
});

test('setStateChangedCallback should call before the router state change and actually trigger when the promise is resolved', (done) => {
  const router = new TestRouter('HASH');
  const states: State[] = [
    {name: 'state1', component: TestComponent, type: 'DEFAULT' },
    {name: 'state2', component: TestComponent, type: 'NORMAL' },
  ];
  const url = router.createUrl('state1', {});
  router.addStates(states);
  const mock = jest.spyOn(router, '_go');
  router.setStateChangedCallback((stateinfo: StateInfo) => {
    return new Promise((resolve) => {
      expect(mock).not.toBeCalled();
      resolve();
      setTimeout(() => {
        expect(mock).toBeCalled();
        mock.mockRestore();
        router.release();
        done();
      }, 500);
    });
  });
  router.go(url);
});

test('clearStateChangedCallback should clear out the callback', () => {
  const router = new TestRouter('HASH');
  router.setStateChangedCallback((stateinfo: StateInfo) => {
    return new Promise((resolve) => resolve());
  });
  router.clearStateChangedCallback();
  expect(router.getStateChangedCallback()).toBeFalsy();
});
import { Component } from '../src/core/component';
import { Service } from '../src/core/service';

const html: string = `
  <div attach="at1" name="a">
    <div attach="at2" name="b">Testing</div>
  </div>
`;

class TestComponent extends Component {
  cb: any;
  constructor(tagName: string) {
    super(tagName);
    this.setHTML(html);
  }
  // this is a private method so give public access to it for testing
  _setHTML(html: string) {
    this.setHTML(html);
  }
  _clearHTML() {
    this.clearHTML();
  }
  getAttachments() : any {
    return this.attachments;
  }
  getComponents() {
    return this.components;
  }
  addDestroyCallback(cb: any) {
    this.cb = cb;
  }
  destroy (){
    this.cb && this.cb();
  }
  getListeners() {
    return this.listeners;
  }
}

class ChildComponent extends Component {
  name: string;
  cb: any;
  flag = false;
  constructor() {
    super('child-component');
  }
  init(name: string, cb?: any) : ChildComponent {
    this.name = name;
    this.cb = cb;
    return this;
  }
  destroy (){
    this.cb && this.cb();
  }
  setFlag() {
    this.flag = true;
  }
}

// Basic Tests
test('Should instantiate a new component instance', () => {
  const component = new TestComponent('test');
  expect(component.e.nodeName).toBe('TEST');
});

test('Should increment the id for every new instance', () => {
  const component = new TestComponent('test');
  expect(component.getId()).toBe(1);
});

test('Should add HTML to the element', () => {
  const component = new TestComponent('test');
  expect(component.e.innerHTML).toBe(html);
});

// Attachment testing
test('Should add attachments to the element', () => {
  const component = new TestComponent('test');
  expect(component.getAttachments().at1.textContent.trim()).toBe('Testing');
});

test('Should be two attachments added to the element', () => {
  const component = new TestComponent('test');
  expect(Object.keys(component.getAttachments()).length).toBe(2);
});

test('Should clear the attachments', () => {
  const component = new TestComponent('test');
  component._clearHTML();
  expect(Object.keys(component.getAttachments()).length).toBe(0);
});

test('Should clear the HTML', () => {
  const component = new TestComponent('test');
  component._clearHTML();
  expect(component.e.innerHTML).toBe('');
});

test('Should iterate over each attachment', () => {
  const component = new TestComponent('test');
  let result = '';
  component.forEachAttachments((e: HTMLElement) => result += e.getAttribute('name'));
  expect(result).toBe('ab');
});

// Attach testing
test('Should attach to a DOM element', () => {
  const component = new TestComponent('test');
  const e = document.createElement('div');
  component.attach(e);
  expect(e.innerHTML).toBe(`<test>${html}</test>`);
});

test('Should attach to a DOM element via selector', () => {
  const component = new TestComponent('test');
  const e = document.createElement('div');
  e.className = 'test-selector';
  document.body.appendChild(e);
  component.attach('.test-selector');
  expect(e.innerHTML).toBe(`<test>${html}</test>`);
});

test('Should append to a DOM element', () => {
  const component = new TestComponent('test');
  const e = document.createElement('div');
  e.innerHTML = '<p>First</p>';
  component.attach(e);
  expect(e.innerHTML).toBe(`<p>First</p><test>${html}</test>`);
});

test('Should replace content in a DOM element', () => {
  const component = new TestComponent('test');
  const e = document.createElement('div');
  e.innerHTML = '<p>First</p>';
  component.attach(e, true);
  expect(e.innerHTML).toBe(`<test>${html}</test>`);
});

test('Should clear attachments on release', () => {
  const component = new TestComponent('test');
  component.release();
  expect(Object.keys(component.getAttachments()).length).toBe(0);
});

test('Should call destroy on release', () => {
  const component = new TestComponent('test');
  let called = false;
  component.addDestroyCallback(() => called = true);
  component.release();
  expect(called).toBe(true);
});

// Child component testing
test('Should create a new component and add it by name', () => {
  const component = new TestComponent('test');
  component.createComponent(ChildComponent, 'test-child').init('childComponent');
  const components = component.getComponents();
  expect(components['test-child'].name).toBe('childComponent');
});

test('Should create a new component and add it, should create an entry by id', () => {
  const component = new TestComponent('test');
  component.createComponent(ChildComponent).init('childComponent');
  const components = component.getComponents();
  let child: ChildComponent;
  Object.keys(components).forEach(k => child = components[k]);
  expect(child && child.name).toBe('childComponent');
});

test('Should create a new component and add it, should create an entry by id', () => {
  const component = new TestComponent('test');
  component.createComponent(ChildComponent).init('childComponent');
  const components = component.getComponents();
  let child: ChildComponent;
  Object.keys(components).forEach(k => child = components[k]);
  expect(child && child.name).toBe('childComponent');
});

test('Should destroy the component by name', () => {
  const component = new TestComponent('test');
  component.createComponent(ChildComponent, '1').init('childComponent1');
  component.destroyComponent('1');
  const components = component.getComponents();
  expect(Object.keys(components).length).toBe(0);
});

test('Should destroy the component by component', () => {
  const component = new TestComponent('test');
  const child = component.createComponent(ChildComponent, '1').init('childComponent1');
  component.destroyComponent(child as Component);
  const components = component.getComponents();
  expect(Object.keys(components).length).toBe(0);
});

test('Should destroy only one component', () => {
  const component = new TestComponent('test');
  const child = component.createComponent(ChildComponent, '1').init('childComponent1');
  component.createComponent(ChildComponent, '2').init('childComponent2');
  component.destroyComponent(child as Component);
  const components = component.getComponents();
  expect(Object.keys(components).length).toBe(1);
});

test('Should destroy the right component', () => {
  const component = new TestComponent('test');
  const child = component.createComponent(ChildComponent, '1').init('childComponent1');
  component.createComponent(ChildComponent, '2').init('childComponent2');
  component.destroyComponent(child as Component);
  const components = component.getComponents();
  expect(components[2].name).toBe('childComponent2');
});

test('Should call release on the destroyed component', () => {
  const component = new TestComponent('test');
  let destroyed = false;
  const child = component.createComponent(ChildComponent, '1').init('childComponent1', () => destroyed = true);
  component.destroyComponent(child as Component);
  expect(destroyed).toBe(true);
});

test('Should clear all the components and release them', () => {
  const component = new TestComponent('test');
  let destroyed1 = false;
  let destroyed2 = false;
    component.createComponent(ChildComponent, '1').init('childComponent1', () => destroyed1 = true);
  component.createComponent(ChildComponent, '2').init('childComponent2', () => destroyed2 = true);
  component.clearComponents();
  const components = component.getComponents();
  const componentCount = Object.keys(components).length;
  expect(componentCount === 0 && destroyed1 && destroyed2).toBe(true);
});

test('Should iterate through all the Child Components', () => {
  const component = new TestComponent('test');
  component.createComponent(ChildComponent, '1');
  component.createComponent(ChildComponent, '2');
  component.forEachComponents((c: ChildComponent) => c.setFlag());
  const components = component.getComponents();
  let sum = 0;
  Object.keys(components).forEach((k: string) => sum += components[k].flag ? 1 : 0);
  expect(sum).toBe(2);
});

// Service Event Listener Testing
test('Should attach a listener to a service', () => {
  const component = new TestComponent('test');
  let eventCalled = false;
  const service = new Service();
  component.addServiceListener<Service>(service, 'testEvent', () => eventCalled = true);
  service.dispatchEvent('testEvent', {});
  expect(eventCalled).toBe(true);
});

test('Should remove a listener to a service', () => {
  const component = new TestComponent('test');
  let eventCalled = false;
  const service = new Service();
  const listener = component.addServiceListener<Service>(service, 'testEvent', () => eventCalled = true);
  listener.remove();
  service.dispatchEvent('testEvent', {});
  expect(eventCalled).toBe(false);
});

test('Should clear a listener to a service', () => {
  const component = new TestComponent('test');
  let eventCalled = false;
  const service = new Service();
  const listener = component.addServiceListener<Service>(service, 'testEvent', () => eventCalled = true);
  listener.remove();
  expect(listener.isRemoved()).toBe(true);
});

test('Release() should remove a listener to a service', () => {
  const component = new TestComponent('test');
  let eventCalled = false;
  const service = new Service();
  component.addServiceListener<Service>(service, 'testEvent', () => eventCalled = true);
  component.release();
  service.dispatchEvent('testEvent', {});
  expect(eventCalled).toBe(false);
});

test('Release() should clear the listeners array', () => {
  const component = new TestComponent('test');
  let eventCalled = false;
  const service = new Service();
  component.addServiceListener<Service>(service, 'testEvent', () => eventCalled = true);
  component.release();
  const count = component.getListeners().length;
  expect(count).toBe(0);
});



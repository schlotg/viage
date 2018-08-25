import { Service } from '../src/core/service';

class TestService extends Service {
  getElement() {
    return this.e;
  }
}

test('Should create a new Service and add a listener', () => {
  const service = new TestService();
  let called = false;
  service.addEventListener('test', () => called = true);
  service.dispatchEvent('test', {});
  expect(called).toBe(true);
});

test('Should only get called on the correct event', () => {
  const service = new TestService();
  let called = false;
  service.addEventListener('test1', () => called = true);
  service.dispatchEvent('test', {});
  expect(called).toBe(false);
});

test('Should not get called if removed', () => {
  const service = new TestService();
  let called = false;
  let listener = service.addEventListener('test', () => called = true);
  listener.remove();
  service.dispatchEvent('test', {});
  expect(called).toBe(false);
});

test('Should have the event payload on callback', () => {
  const service = new TestService();
  let called: any;
  let listener = service.addEventListener('test', (p: any) => called = p);
  service.dispatchEvent('test', 'payload1');
  console.log(called);
  expect(called.detail).toBe('payload1');
});

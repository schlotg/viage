export interface Filter<T> {
  (e: T): boolean;
}

export interface Callback<T> {
  (e: T): void;
}

export interface AnimateCallback {
  (time: number): boolean;
}

export interface Validator {
  (val: string | boolean) : string;
}

export interface Validators {
  [index: string]: Validator;
}

 // determine if compatible browser
 export function isCompatible(): boolean {
  const ua = window.navigator.userAgent;
  return (ua.indexOf('MSIE ') < 0 && ua.indexOf('Trident/') < 0);
}

// generate a unique ID
const MAX_COUNTER = Math.pow(2, 32);
let counter = 0;
export function generateId() : string {
  let id = `${Date.now().toString(16)}:${counter.toString(16)}`;
  counter += 1;
  counter = (counter >= MAX_COUNTER - 1) ? 0 : counter + 1;
  return id;
}

// remove an element from an array
export function removeElement<T>(elements: T[], element: T) {
  for (let i = 0; i < elements.length; ++i) {
    if (elements[i] === element) {
      elements.splice(i, 1);
      break;
    }
  }
}

// remove an element from an array if it passes a test
export function remove<T>(elements: T[], filter: Filter<T>) {
  for (let i = 0; i < elements.length; ++i) {
    if (filter(elements[i])) {
      elements.splice(i, 1);
      break;
    }
  }
}

// debounce
export function debounce<T> (cb: Callback<T>, delay: number) {
let handle: number;
  return (data: T) => {
    clearTimeout(handle);
    handle = setTimeout(() => cb(data), delay);
  }
}

// throttle
export function throttle<T> (cb: Callback<T>, delay: number) {
  let handle: number;
  const latest: { data: T } = {} as { data: T };
  return (data: T) => {
    latest.data = data;
    (!handle) ? cb(data) : handle = setTimeout(() => {
      cb(latest.data);
      handle = null;
    }, delay);
  };
}

// Keeps animating until the callback returns false
// or the duration expires
export function animate (cb: AnimateCallback, durationMills?: number){
  const start = performance.now();
  const animateInternal = () => {
    const now = performance.now();
    const delta = now - start;
    if (cb(delta) && (!durationMills || delta < durationMills)) {
      requestAnimationFrame(animateInternal);
    }
  }
}

// Form functions
// get data from various types of form elements. Use the 'to' attribute to convert to float or integer
export function getFormData<T>(e: HTMLElement, names: string[]) : T {
  const data:any = {};
  names.forEach((name: string) => {
    const element = e.querySelector(`[name=${name}]`) as HTMLInputElement;
    data[name] = element.hasAttribute('checked') ? element.checked : element.value;
    const to = element.getAttribute('to');
    if (to === 'float') {
      data[name] = data[name] ? parseFloat(data[name]) : undefined;
    } else if (to === 'int') {
      data[name] = data[name] ? parseInt(data[name]) : undefined;
    }
  });
  return data as T;
}

// set form data
export function setFormData<T>(e: HTMLElement, data: T) {
  for (let k in data) {
    const element = e.querySelector(`[name=${k}]`) as HTMLInputElement;
    if (element) {
      element.hasAttribute('checked') ? element.checked = !!data[k] : element.value = `${data[k]}`;
    }
  }
}

// set form validation functions. If a entry is valid return and empty string,
// else return a error string
export function setFormValidation<T>(e: HTMLElement, validators: Validators) {
  for (let k in validators) {
    const element = e.querySelector(`[name=${k}]`) as HTMLInputElement;
    if (element) {
      element.addEventListener('input', () => {
        const val = element.hasAttribute('checked') ? element.checked : element.value;
        element.setCustomValidity(validators[k](val))
      });
    }
  }
}

// determine if a form is valid
export function isFormValid(e: HTMLElement): HTMLInputElement[] {
  const badNodes = e.querySelectorAll(':invalid');
  const badEntries: HTMLInputElement[] = [];
  if (badNodes.length) {
    for(let i = 0; i < badNodes.length; ++i) {
      badEntries.push(badNodes[i] as HTMLInputElement);
    }
  }
  return badEntries;
}


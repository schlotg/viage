# Viage API
## Components
All components need to derive off of the Component class. This class gives you the following functionality:

### Element
Each component has a element whose named gets passed down through the constructor. You can access via this.e .

### setHTML(html: string)
This will replace the HTML associated with the components element. It will add any elements in the HTML that have the attach attribute and add them to this.attachments. As an example if the HTML contained a string like this:

``` <div attach="container"></div> ```

this.attachments.container will contain the element specified above.

### release(): void
This function is called by the system and can be called manually to destroy and cleanup the component. This will release any references to other components and call a destroy function in the class if it exists.

### attach(attachPoint: HTMLElement | string, replace?: boolean)
Attach allows a component attach itself to another element. You can pass in the element to attach to, or a selector string. The optional replace parameter replaces the inner contents of an element, otherwise it is appended to the end.

### createComponent<A extends Component>(c: new () => A, name?: string): A
This function creates a child component and automatically adds it to this.components. If the optional name parameter is not used then a id is created and the it is added to this.components using the id as a key

Example:
```Javascript
  updateList(){
    this.clearComponents();
    this.attachments.list.innerHTML = '';
    ShoppingListService.forEach(e => {
      this.createComponent(ShoppingListElement).init(e)
        .attach(this.attachments.list);
    });
  }
```

### destroyComponent(name: string)
Destroy a createdComponent by name.

### clearComponents()
Clear out all the created Components

### addServiceListener<A extends Service>(service: A, event: string, cb: any)
This adds an event listener to a service. This will automatically be removed when the component gets destroyed. This uses a intermediate class that manages the intricacies of addEventListener API and its difficulties with classes and arrow functions.

Example use:
```Javascript
    this.addServiceListener(ShoppingListService, 'update', () => this.updateList());
```

The resultant intermediate class is stored in this.serviceListeners

### forEachAttachments(cb: forEachCB)
This is a helper function that allows you to apply a callback function on all the attachments

### forEachComponents(cb: forEachCB)
This is a helper function that allows you to apply a callback function on all the child components

## Service
All services must derive off of the Service base class. This class gives you the following functionality:

### addEventListener(event: string, cb: any) : Listener
The service base class creates a private element that lets listeners be attached. This function adds an event listener to an event. It returns the intermediate listener class

### dispatchEvent(_event: string, data: any)
Dispatch event lets you dispatch a custom event with data to all your listeners

## Listener
The intermediate listener class takes care of all the intricacies of the addEventListener API. It is hard to remove a event listener once it is added if you use a arrow function or a class method. This is not meant to be used directly but is used by the Service listeners. Calling remove() on this returned class removes the event listener.

The class looks like this:

```Javascript
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
```

## Router
Viage comes with a built in Router that is small but very functional. The Routers used in a app should be created up front in the app.ts. Then any component that needs to access them get one by name.

### createRouter(name: string, portal: HTMLDivElement, hookUrl?: boolean)
This creates a router by the name passed in. The portal is the HTML element that the router will render into. hookUrl is a optional flag that specifies that the router will use the URL bar.

```Javascript
    import { createRouter } from 'viage';
    const router = createRouter('main', this.attachments.portal, true);
    router.addStates([
      { name: 'home', component: ShoppingList,  paramsList: [] },
      { name: 'add', component: ShoppingListAdd,  paramsList: [] },
      { name: 'edit', component: ShoppingListAdd,  paramsList: ['id'] },
    ]);
    router.setDefaultState('#home');

```

### getRouter(name: string)
GetRouter gets a previously created router by name. This allows any component to get an created router.

### addStates(states: State[])
This function configures the router with its states. Name is the url, component is the component that will be rendered into the portal. The parameter list is an array of strings that will associated with data in the URL. The data will be added to the components params member. The component should define this member so that typescript is happy.

As an example using the above edit state, if the url is #edit/5, then this.params.id will equal 5

Here is what the code should look like:

```Javascript
export class ShoppingListAdd extends Component {

  params = {id: ''};
  ...
```

### addState(state: State)
This method allows you to add a state one at a time.

### removeState(name: string)
This function allows you to remove a state by name.

### setDefaultState(url: string)
This function sets a default state.

### go(url: string)
This function allows manual triggering of state changes.

```Javascript
  getRouter('main').go('#home');
```
If a router has been created with hooUrl = true, then you can also use #home in an anchor or link and when clicked it will be the same as calling go('#home').

### back()
This function goes back to the previous router state. If there was not a previous state then it goes to the default state

## isCompatible()
This is a quick and dirty function to detect if the browser is IE. While not an exhaustive compatability check there are very few browsers in use that are not IE, Edge, Safari, Chrome, Firefox or there mobile counterparts. One of the design considerations to keep this library small, is to ignore IE support. The viage-cli creates template projects that has code that looks like this:

index.html:
```Javascript
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8"/>
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>
  <body>
    <page>
      <p style="text-align: center" id="viage-loading">Loading....</p>
    </page>
    <script>
      window.addEventListener('load', () => {
        setTimeout(() => {
          const e = document.querySelector('#viage-loading');
          if (e) {
            e.textContent = 'This page is not supported by your browser. Please consider using Safari, Firefox, Edge, or Chrome';
          }
        }, 1000);
      });
    </script>
  </body>
</html>

```

index.ts:
```Javascript
import { App } from './components/app';
import './index.css';
import { isCompatible } from 'viage';

export let app: App;
if (isCompatible()) {
    app = new App();
}

```

This code displays Loading... if the app takes a while to execute and then displays a warning message if the browser is IE or if a exception was thrown during the initialization process. This is exposed and kept simple so that if you need a more exhaustive browser compatability check, you can easily implement one.
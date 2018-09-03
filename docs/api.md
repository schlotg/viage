# Viage API
## Components
All components need to derive off of the Component class. This class gives you the functionality give you the methods below via inheritance.

Some usage notes:
- The base constructor must have a tag name passed into it. A DOM element by this name is constructed and stored in **this.e**
- Implement and use a *init()* function to configure your components. This is a great place to pass in configuration data, etc... The router will use the init function to pass in state data when a state change is detected. The constructors should have minimal configuration happening in them
- Use the attach method to attach this component to an existing DOM element
- Use the attach attribute in your HTML to automatically to attach elements to this component. They will show up in **this.attachments** which is a map with the attach name as the key
- Use the createComponent() method to create and automatically add components to the component. Added Components will show up in **this.components** which is a map with the component name as a key
- Use clearComponents() or destroyComponent() to automtically remove the the component and call release on it
- Use addServiceListener and removeListener to add listeners to a service. This takes care of unregistering the event listeners on release or a remove. The listeners are stored in the array **this.listeners**
- Release will clean up all the attached listeners, components, and attachements
- Configure the class in an **init()** function instead of the constructor. THe constructor should simply call the **super()** function with the tag name.

### Element
Each component has a element whose named gets passed down through the constructor. You can access via **this.e**. A call to attach() will append this element into the element to be attached to.

### addServiceListener<A extends Service>(service: A, event: string, cb: any)
This adds an event listener to a service. This will automatically be removed when the component gets destroyed. This uses a intermediate class that manages the intricacies of the **addEventListener** API and its difficulties with classes and arrow functions.

Example:
```Javascript
    this.addServiceListener(ShoppingListService, 'update', () => this.updateList());
```

The resultant intermediate class is stored in **this.serviceListeners**

### attach(attachPoint: HTMLElement | string, replace?: boolean)
Attach allows a component to attach itself to another element. You can pass in the element to attach to, or a selector string. The optional replace parameter replaces the inner contents of an element, otherwise it is appended to the end.

### clearComponents()
Clear out all the created Components

### protected clearHTML()
Sets the HTML of the component to an empty string and clears out the attachments member

### createComponent<A extends Component>(c: new () => A, name?: string): A
This function creates a child component and automatically adds it to **this.components** . If the optional name parameter is not used then a **id** is created and the it is added to the **this.components** object using the **id** as a key. If the owning class has a router configured it is assigned to class created using this function.

Example:
```Javascript
  updateList(){
    // remove any components
    this.clearComponents();
    // clear out any existing inner HTML
    this.attachments.list.innerHTML = '';
    ShoppingListService.forEach(e => {
      this.createComponent(ShoppingListElement).init(e)
        .attach(this.attachments.list);
    });
  }
```

### destroyComponent(name: string)
Destroy a created Component by name.

### forEachAttachments(cb: forEachCB)
This is a helper function that allows you to apply a callback function on each of the attachments

### forEachComponents(cb: forEachCB)
This is a helper function that allows you to apply a callback function on all of the child components

### getId()
Returns the unique ID associated with this component. Every component has its own unique ID that is generated when it is created.

### release(): void
This function is called by the system and can be called manually to destroy and cleanup the component. This will release any references to other components and call a destroy function in the class if it exists.

### removeListener(target: Listener)
This takes a listener, calls remove on it and removes this instance from the list of listneners in the component.

### protected setHTML(html: string)
This will replace the HTML associated with the components element. It will add any elements in the HTML that have the attach attribute and add them to this.attachments. As an example if the HTML contained a string like this:

``` <div attach="container"></div> ```

this.attachments.container will contain the element specified above.


## Service
All services must derive off of the Service base class. This class gives you the following functionality:

### addEventListener(event: string, cb: any) : Listener
The Service base class creates a private element that lets listeners attach. This function adds an event listener to an event. It returns the intermediate listener class. If using a component to listen to a service, user the components addServiceListener()

### dispatchEvent(_event: string, data: any)
Dispatch event lets you dispatch a custom event with data to all your listeners

## Listener
The intermediate listener class takes care of all the intricacies of the addEventListener API. It is hard to remove a event listener once it is added if you use a arrow function or a class method. This class is not meant to be used directly and is used by the Service listeners. Calling remove() on this returned class removes the event listener.

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
Viage comes with a built in Router. It can be configured as a Hash, Location, or Standalone router. It is small but very functional. Routers should be created up front in app.ts. Any component that needs to access can get one by name.

#### Types
- Hash: A Hash Router usese the # symbol in front of a route in a URL imitating anchor links. This prevents the browser from actually loading a new page when the the location url has changed. This type of router is great for standalone apps that need to work without network connectivity. Once loaded, the app does not need to access the network except to make REST API calls if needed.

- Location: A location Router actually reloads the location from the server. While this might seem like a horrible waste of network bandwidth, in reality its pretty small. What actually happens is a request goes out for the index.html. This file is small in a Viage app. From there it will try to load the Viage bundle.js and any asset files. The URLs for these assets are unchanged, and therfore the server should respond with a 304 (Not Modified) and the browser will used the cached versions of these files. When the app loads up and initializes, the router inspects the current URL and makes the appropriate state changes internally. In some other Location Router implementations, the route information is formatted something like this: https://foo.com/page1/foo and https://foo.com/page2/foo. This type of URL formatting is definetly easier to read, but it relies on the server being configured to always return back index.html if it can't find a file at that path. If your website contains several different web apps each with their own router and all at the same domain, it gets difficult to configure the server to make everything work properly. Viage sacrifices URL readability for easy deployment. The router state is encoded as a parameter along with any the data needed for the state. A Viage location router URL looks something like: https://home.html?s=bar;d=5;. This makes it easy to have have another Viage app at the same domain that deals with user information: https://user.html?s=foo;d=7; and requires minimal server configuration.

- Standalone: A Standalone Router is a great way to manage content in a subpane that is active within one of your main router states. It does not use the built in location mechanisms of the browser and the Router must be called directly to perform state changes. This is done through the go() and back() function calls.

#### Basic Operation
- A Router is created and configured by name using **createRouter()**. This should probably be done in app.ts. Other components can access a router by calling the **getRouter()** function and passing in a name. You can trigger a route or state change for Location and Hash Routers by clicking links, using the browsers back and forward buttons, and by calling **go()** and **back()**. Standalone Routers can only use **go()** and **back()**.

- You can only have one Hash or Standalone Router at a time because the take over the browsers location and history object, but you can have as many Standalone routers as needed.

- Urls to trigger router state changes should be generated using the **createUrl()** function. This eliminates any guessing or incorrect generation of URLS. This function automatically takes in account the type of Router being used and also makes your code more immune to any future Router code changes.

- States are configured with a name and a component associated with the State. When a state change is triggered, a component is created and configured with the state's data passed into the newly created component's contructor. This component is then attached to the Router's portal and renders its content into it.

- A Portal is simply a DOM element that the Router will render the current state into and is set when the Router is configured.

- After an App is loaded and the Routers are configured, **start()** should be called on the router. This tells the router to grab the app's current URL from location.href, or set the default if a Standalone router, and then make the appropriate state change based on it's contents.

- Router's should be configured with a default state to enter if the URL doesn't make sense or when it doesn't contain and state information.

## Router API

### createRouter(name: string, portal: HTMLDivElement | string, type: RouterType) : void
This creates a router using the name passed in. The portal is an HTML element that the router will render into and can be an actual element instance or a CSS selector for one.

```Javascript
    import { ShoppingList } from './shopping-list';
    import { ShoppingListAdd } from './shopping-list-add';
    import { createRouter, RouterType, StateType } from 'viage';
    const router = createRouter('main', this.attachments.portal, RouterType.HASH);
    router.addStates([
      { name: 'home', component: ShoppingList,  type: StateType.DEFAULT },
      { name: 'add', component: ShoppingListAdd,  type: StateType.NORMAL },
      { name: 'edit', component: ShoppingListAdd,  type: StateType.NORMAL },
    ]);
    router.start();

```

When the state is activated, a new Component is allocated, configured with the router (ie this.router will be set to the router that created it), and then if it exists, init will be called with the data associated with the URL.

### getRouter(name: string)
Gets a previously created router by name. This allows any component to get any created router.

### addStates(states: State[])
Where state is defined as:
```Javascript
export interface State {
  name: string;
  component: any;
  type: 'DEFAULT' | 'NORMAL';
}
```

This function configures the router with its states. **name** is the url, **component** is the component that will be rendered into the portal. The type is either 'DEFAULT' or 'NORMAL'. THere can only be one DEFAULT state and the others must be NORMAL states.

Use the **createUrl()** function to create URLs and embed data in them. Any JSON-able data can be used to construct the URL.

See the Shopping List Demo for more details.

### back()
This function goes back to the previous router state. If there was not a previous state then it goes to the default state.

### clearStates()
Clears out all the existing states in a router.

### createUrl<T>(state: string, data?: T)
This creates a URL out of a state string and a JSON-able data parameter. The T parameter is the data type being passed in.

```Javascript
const homeUrl = this.router.createUrl<void>(States.HOME);
const editUrl = this.router.createUrl<Id>(States.EDIT, {id: this.item._id});
```

### getName()
Returns the Router's name.

### getType()
Returns the Router's type

### go(url: string)
This function allows manual triggering of a state change. Use the **createUrl()** function to generate the URL.

```Javascript
  const router = getRouter('main');
  const homeUrl = router.createUrl('home');
  router.go(homeUrl);
```
For Location and Hash routers, you can also trigger a state change by using setting links, setting location.href, by using the back and forward browser buttons, and by calling **back()**.

### removeState(name: string)
This function allows you to remove a state by name.

### start()
Tells a router to activate itself and start routing. This should be called as soon as the Router is configured.

## Misc
### isCompatible()
This is a quick and dirty function to detect if the browser is IE. While not an exhaustive compatability check, there are very few browsers in use that are not IE, Edge, Safari, Chrome, Firefox or their mobile counterparts. One of the design considerations to keep this library small, is to ignore IE support. The Viage  Cli creates template projects that has code that looks like this:

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

This code displays Loading... if the app takes a while to execute and then displays a warning message if the browser is IE or if a exception was thrown during the initialization process. When the App component is executed it renders into the **page** element replacing the Loading... message.

This is exposed and kept simple so that if you need a more exhaustive browser compatability check, you can easily implement one. If you want to remove the check all together, that should be easy enough to do as well.
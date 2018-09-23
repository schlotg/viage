# Designing a Router in Viage
This is some information that I discovered while writing the Router for Viage. I hope you find it useful.

## Design Goals
* Make it as simple as possible
* Don't worry about backwards compatability with older browsers such as IE
* Support routing that doesn't need to use the DOM's location and History API
* Prevent page loads when on route state changes

## Router Types
### HTML5 Router
HTML5 supports the concept of a router via history.pushState(), history.replaceState(), and the onpopstate event.

The rules are as follows:
- history.pushState/replaceState adds a new entry to the history queue, changes the title bar, but does not cause a reload or fire the popstate event.
- The onpopstate event is fired when a back or forward button traverse from one pushed State to another. The browser will not reload.
- None of these things impact assigning a location.href value or clicking an anchor. This means that implementing a router based on this API cannot use anchors, links, or location.href with out triggering a reload.

### Hash Router
A Hash router relies on the fact that # links do not cause browser reloads. All state changes have to be encoded as a hash route. To detect external changes you can listen to the onpopstate event and the hashchange event. This type of router works well with history.back(), anchors, links, and location.href assignments. It does not cause the browser to load new files. Althought you can certinaly code up a hash router to dynamically load chunks of code based on state.

### Location Router
This type of Router just loads a new location but when the application loads the location is examined to determine the state. This type of router does not need to listen to any events. However, this type of router relies on some server functionality to always serve up index.html when it can't resolve the file path. You can get around that by using the url parameter syntax and store the state info in a variable and always load index.html. This type of router cases a browser load on every state or url change.

### Standalone Router
This type of router doesn't use the Location or History objects and must be called directly to go to a new location or to go back. It simply renders the result of the current state into a designated portal.

### Problems the above routers suffer from (except standalone)
Some libraries, such as Bootstrap, assign '#' to anchors and then capture the click event. When the object is clicked, this adds a history entry. To go back, one must cycle through these hash entries which can be annoying and a unexpected behavior. Avoid code that creates hash entries in the browser's history.

### Misc
- All of the above routers, expect standalone, should look at the location when they start and change to the appropriate state on load. This allows links to be stored that take the user directly to the state from which the link was captured.
- It is a good idea to implement an API to create a URL based on state and parameters. This makes generating links less error prone and removes any guess work.
- Inside the web app, consider not using any # urls outside of hash router states. Anchor tags won't have an underlined link look if nothing is assigned to the href attribute. This is why many people assign '#' and then add a click handler. I would avoid this altogether. You can always style text to look like an anchor or link.
- Consider not having one big page with anchor points. Instead, use multiple router pages to display the info and avoid hash anchor points all together.

## Decisons based on the above information
- I have decided to rule out the HTML5 router. Not being able to use links, anchors, and href will just make it to painful to use.
- Because they are very similar and to have maximum flexability, I implemented HASH, STANDALONE, and LOCATION routing in one class. The type of router is just a configuration item.
- To prevent issues with servers having to be specially configured, I am going to store the route state as url params so the server will always try to serve the same location.



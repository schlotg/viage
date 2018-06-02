# Welcome to Via.js
Why does the world need another Javascript Framework? Well it doesn't, and that's why this isn't a framework at all but rather some minimal base classs and a collection of best practices and principles.

## It is 2018
Am I the only one that is dismayed at the current state of Web development? If I want to use use Bootstrap with Angular I have to download a special Angular version of the library. If I decide to use Botstrap with React I need to use the React version. There seem to be at least 3 versions of every library, a React, Angular, and native Javascript version. Add to the frustration, there are the native DOM APIs and then different APIS for Angular, React, and whatever the latest framework of the month is.

According to the various Web stats, less than 5% of all web traffic is IE and its market share is shrinking fast. This leaves about 95% of the world using modern up-to-date browsers. In 2018 browsers have some really nice DOM APIs that are easy to use and standard across the big 4 (Chrome, Edge, Firefox, and Safari). Modern browsers now support ES6 features like Classes, Promises, etc... With all that and tools like Typescript and Webpack, why do we need frameworks again?

That is exactly the question I am trying to answer. If I just uses some reasonable practices and modern features, do these frameworks really buy us anything? Here are the design principles I am using:

- Use only Modern APIs that are standard across the big 4 architectures
- Take advantage of modern language features
- Keep everything as simple as possible while still maintaing easy development
- Be as comppatible as possible with already existing Javascript libraries and standards
- Take advantage of best of breed offline tools such as NPM, Webpack, and Typescript
- Minimize the amount learning required

## So what exactly is VIA
Via is simply 4 very tiny classes and a cli that does the work of setting up a skeleton project. It configures Typescript and Webpack so all you have to do is start writing code. If you don't like the 4 classes I provide you don't have to use them. You can write you own base code but still use via to create started skelton project if you like.

### Is Via fast?
It turns out that a lot of time and effort goes into making Browsers fast with the native APIs. Using them produces good results. To verify this I implemented a version of the React Fiber Demo in Via and it is at least as fast as React Fiber. You can see for yourself here.

### Is Via small?
To test this I created a shopping list app in Angular, React, and Via. The total code sizes generated for each framework is shown below:

|----------|----------|
| Via      | 14KB     |
| Angular  | 3.884 MB |
| React    | ???      |

### Is Via easy?
I think so. If you compare the React, Angular, and Via versions of the Shopping List App. You will see that a similar amount of code had to be written to create the app for each framework. If anything, I think the Via version wins at being the smallest and easiest to understand.

### What are the advantages of Via?
Besides being fast, extremely small, and very compatible with existing libraries, Via relies on standard web technologies that are already well documented and well maintained. A side effect of this is that Via has a low complexity and minimal code base.

## Getting Started
- Open a terminal or command line prompt and change directory to your projects directory
- If you haven't already installed the Via CLI:
```
  npm install -g via-cli
```
- Now create an empty project that will output a 'Hello From Via' Page. You can use any project name but this example uses hello-world-via
```
  npm install -g via-cli
  via create hello-world-via
  cd hello-world-via
```
- This will create an empty project that is all configured and ready to go. To run it type:
```
  npm run start
```
- You should see a development server start and a browser window open with a message that says: 'Hello From Via'

## Commands
- *npm run start* - Builds and launches a Development Webserver
- *npm run build* - Builds the project in release and outputs it to dist/
- *via create \<project-name\>* - creates a skeleton project
- *via addComponent \<component-name\>* - creates a new component and adds it to the project
- *via addService \<service-name\>* - creates a new service and adds it to the project

## How To Via

### Components and Services
There are three basic types of Via objects, Components and Services, and a special object called a Router

#### Components
Components contain HTML and other components. Components communicate down stream by calling functions directly in their children much like React does. Sometimes a parent needs to know that something changed in a child component. That can be done emitting and event, supporting a callback API between parent and child, and notification via a Service.

#### Services
Services are singletons that are usually a data repository. They should handle the saving and getting of data and provide a mechanism to notify everyone else when the data has changed. Services are a little Angularish. The Service base class has some helpers for adding listeners and dispatching events.

### Router
Via also has a quick and dirty router that is about 150 lines of code. The Router allows Single Page Apllications to be created quickly and easily. The Router maps routes to components which render into a common element in the DOM.

## Shopping List Tutorial
The quickest way to learn via is to Walk through a simple shopping list app. You can find that here

## API
The Via API is documented here

## TODOs
- Create a Via CLI
- Create a standalone Via Project
- Create the shopping list tutorial
- Create projects for Angular Shopping List and React Shopping list
- Create the project for Via Triangle demo and figure out a way to host the page
- Create a real app using Via
# Welcome to Viage.js
Why does the world need another Javascript Framework? Well it doesn't, and that's why this isn't a framework at all but rather some minimal base classs and a small set of practices and principles.

## It is 2018
Am I the only one that is dismayed at the current state of Web development? If I want to use use Bootstrap with Angular I have to download a special Angular version of the library. If I decide to use Botstrap with React I need to use the React version. There seem to be at least 3 versions of every library, a React, Angular, and native Javascript version. Adding to the frustration, there are the native DOM APIs and then different APIS for Angular, React, and whatever the latest framework of the month is.

According to the various Web stats, less than 5% of all web traffic is IE and its market share is shrinking fast. This leaves about 95% of the world using modern up-to-date browsers. In 2018, browsers have some really nice DOM APIs that are easy to use and standard across the big 4 (Chrome, Edge, Firefox, and Safari). Modern browsers now support ES6 features like Classes, Promises, etc... Add in great tools like Typescript and Webpack, why do we need frameworks again?

That is exactly the question I am trying to answer. If I just uses some reasonable practices and modern features, do these frameworks really buy us anything? Here are the design principles I am using:

- Use only Modern Web APIs that are standard across the big 4 architectures
- Take advantage of JS / TS modern language features
- Keep everything as simple as possible while still maintaing easy development
- Be as comppatible as possible with already existing Javascript libraries and standards
- Take advantage of offline tools such as NPM, Webpack, and Typescript
- Minimize the amount learning required

## So what exactly is Viage
Viage is simply 4 very tiny classes and a CLI. The CLI takes care of setting up skeleton projects. It configures Typescript and Webpack so all you have to do is start writing code. If you don't like the 4 classes I provide you don't have to use them. You can write you own base code but still use Viage to create a starter skelton project if you like.

### Is Viage fast?
It turns out that a lot of time and effort goes into making browsers fast with the native APIs. Using them produces good results. To verify this I implemented a Viage version of the React Fiber Demo. It is at least as fast as React Fiber. You can see for yourself here (coming soon).

### Is Viage small?
To test this I created a shopping list app in Angular, React, and Via. The total code sizes generated for each framework is shown below:

|----------|---------------|
| Via      | 14KB          |
| Angular  | 3.884 MB      |
| React    | (Coming soon) |

### Is Viage easy?
I think so. If you compare the React, Angular, and Viage versions of the Shopping List App. You will see that a similar amount of code had to be written for each framework. If anything,I think the Viage version wins at being the smallest and easiest to understand.

### What are the advantages of Viage?
Besides being fast, small, and very compatible with existing libraries, Viage relies on standard web technologies that are already well documented and well maintained. A side effect of this is that Via is very low complexity and minimal.

## Getting Started (Viage CLI Coming Soon)
- Open a terminal or command line prompt and change directory to your projects directory
- If you haven't already installed the Viage CLI:
```
  npm install -g viage-cli
```
- Now create an empty project that will output a 'Hello From Viage' Page. You can use any project name but this example uses hello-world-viage
```
  npm install -g via-cli
  via create hello-world-viage
  cd hello-world-viage
```
- This will create an empty project that is all configured and ready to go. To run it type:
```
  npm run start
```
- You should see a development server start and a browser window open with a message that says: 'Hello From Viage'

## Commands
- *npm run start* - Builds and launches a Development Webserver
- *npm run build* - Builds the project in release and outputs it to dist/
- *via create \<project-name\>* - creates a skeleton project
- *via addComponent \<component-name\>* - creates a new component and adds it to the project
- *via addService \<service-name\>* - creates a new service and adds it to the project

## How To Viage

### Components and Services
There are three basic types of Viage objects, Components and Services, and a special object called a Router

#### Components
Components contain HTML and other components. Components communicate down stream by calling functions directly in their children much like React does. Sometimes a parent needs to know that something changed in a child component. That can be done by emitting and event, supporting a callback API between parent and child, and notification via a Service.

#### Services
Services are singletons that are usually a data repository. They should handle the saving and getting of data and provide a mechanism to notify everyone else when the data has changed. The Service base class has some helpers for adding listeners and dispatching events.

### Router
Viage also has a quick and dirty router that is about 150 lines of code. The Router allows Single Page Apllications to be created quickly and easily. The Router maps routes to components which render into a common element in the DOM.

## Shopping List Tutorial
The quickest way to learn via is to Walk through a simple shopping list app. You can find that here (coming soon)

## API
The Viage API is documented here (coming soon)


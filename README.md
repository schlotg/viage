# Welcome to Viage.js
Why does the world need another Javascript Framework? Well it doesn't, and that's why this isn't a framework at all but rather some minimal base classs, tools, and a small set of practices and principles.

## It is 2018
Am I the only one that is dismayed at the current state of Web development? If I want to use use Bootstrap with Angular, I have to install a special Angular version of the library. If I decide to use Botstrap with React, I need to use the React version. There seems to be at least 3 versions of every library, a React, Angular, and native Javascript version. Adding to the frustration, there are the native DOM APIs and then different APIS for Angular, React, and whatever the latest framework of the month is.

According to various Web stats, less than 5% of all web traffic is IE, and its market share is shrinking fast. This leaves about 95% of the world using modern up-to-date browsers. In 2018, browsers have some really nice DOM APIs that are easy to use and standard across the big 4 (Chrome, Edge, Firefox, and Safari). Modern browsers now support ES6 features like Classes, Promises, etc... Add with great tools like Typescript and Webpack, why do we need giant frameworks again?

## React and Angular
While React and Angular solve a lot of problems and are amazing, I still find myself having issues:

* When I work with React, I find that JSX and the virtual DOM get in my way. I end up adding DIV elements that act as containers so the JSX compiler is happy. There are limits on what you can do with inline styling, and things that were easy, such as styling buttons, are now harder. Getting data out of a form, means I have add handlers to each field so that when the data changes, I can keep track of it. Because I am interacting with a virtual DOM, I can't just ask the form elements for their values. Because everything is passed down through components, including callbacks to notify the parents of changes, I often find that changing functionality requires changes in the entire parent child chain.

* When I work with Angular, I find that its complexity is high. Because you have to use a lot of HTML directives in your HTML, there is a learning curve for yet another part of this large framework. The HTML template directives are hard to debug because you can't step into them. Passing data in and out of a component should be trivial and its not. Adding a module usually requires me to modify code in several files and almost every bit of standard functionality has a new and different Angular counterpart. For instance, adding a click handler should be as close to the DOM APIs as possible but instead you use: ```(click) ```.

## A Better Way?
So is there a better way that relies on existing DOM and JS functionality?

That is exactly the question I am trying to answer. If I just use some reasonable practices and modern features, do these large frameworks really buy me anything? Here are the design principles I am using in this project:

- Use only Modern Web APIs that are standard across the big 4 browsers
- Take advantage of JS / TS modern language features
- Keep everything as simple as possible while still maintaining easy development
- Be as compatible as possible with already existing Javascript libraries and standards
- Take advantage of offline tools such as NPM, Webpack, and Typescript
- Minimize the amount learning required
- Keep everything component based

## So what is Viage?
Viage is simply 4 very tiny classes, some design principles, and a [CLI](https://github.com/schlotg/viage-cli). The CLI takes care of setting up skeleton projects. It configures Typescript and Webpack so all you have to do is start writing code.

### Is Viage fast?
It turns out that a lot of time and effort goes into making browsers fast with the native APIs. Using them produces good results. To verify this I implemented a Viage version of the React Fiber Demo. It is as least as fast as React Fiber. You can see for yourself [here](https://github.com/schlotg/viage-sierpinski)

### Is Viage small?
To test this I created a shopping list app in Angular, React, and Viage. The total code sizes generated for each framework is shown below:

| Framework | Size          |
|-----------|---------------|
| Viage     | 19KB          |
| Angular   | 351KB         |
| React     | 158KB         |

**You can see that Viage in this test case is 8-18 times smaller!**

For the sake of codes size and complexity comparisons, I have implemented this same app in React and Angular. I tried to keep the code as similar as possible within the bounds of each framework. You can find them and a running Viage version here:

[Viage](https://schlotg.github.io/shopping-list.html#home)

[React - running](https://schlotg.github.io/react-shopping-list/index)

[React - project](https://github.com/schlotg/react-shopping-list)

[Angular - running](https://schlotg.github.io/angular-shopping-list/home)

[Angular - project](https://github.com/schlotg/angular-shopping-list)

### Is Viage easy?
I think so. If you compare the React, Angular, and the Viage versions of the Shopping List App. You will see that a similar amount of code had to be written for each framework. It is my opinoin that the Viage version wins at being the smallest and easiest to understand.

### What are the advantages of Viage?
* Viage is fast and small
* Viage is and very compatible with existing libraries
* Viage relies on standard web technologies that are already well documented and well maintained
* A side effect of this is that Viage has a low complexity and is minimal
* Viage is easy to learn

## Getting Started
- Open a terminal or command line prompt and change directory to your projects directory
- If you haven't already installed the Viage CLI:
```
  npm install -g viage-cli
```
- Now create an empty project that will output a 'Hello From Viage' Page. You can use any project name but this example uses hello-world-viage
```
  npm install -g viage-cli
  viage app hello-world-viage
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
- *npm run build-embedded* - Builds the project in release and outputs it to dist/ and embeds the bundle.js into the HTML
- *viage app \<project-name\>* - creates a skeleton project
- *viage component \<component-name\>* - creates a new component and adds it to the project
- *viage service \<service-name\>* - creates a new service and adds it to the project

## How To Viage

### Components and Services
There are three basic types of Viage objects, Components and Services, and a special object called a Router.

#### Components
Components contain HTML and other components. Components communicate down stream by calling functions directly in their children much like React does. Sometimes a parent needs to know that something changed in a child component. That can be done by emitting and event, supporting a callback API between parent and child, and notification via a Service.

#### Services
Services are singletons that are usually a data repository. They should handle the setting and getting of data and provide a mechanism to notify everyone else when the data has changed. The Service base class has some helpers for adding listeners and dispatching events.

### Router
Viage also has a quick and dirty router that is about 150 lines of code. This is a Hash Router and it allows Single Page Apllications to be created quickly and easily. The Router maps routes to components which render into a common element in the DOM.

## Shopping List Tutorial
The quickest way to learn Viage is to walk through a simple shopping list app. You can find that [here](https://github.com/schlotg/viage-shopping-list)

## API
The Viage API is documented [here](docs/api.md)


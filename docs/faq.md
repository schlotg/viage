# Viage FAQ

## How do I update Viage?
In the project that you want to update it in, type the following:
```Javascript
    npm install --save-dev viage
```

## How do I update the Viage CLI?
From any command line, type the following:
```Javascript
    npm install -g viage-cli
```

## How do I add a simple server, besides the webpack-development server, so I can test release builds without deploying?
Viage CLI projects already come with this option. Just type:
```
    npm run build
    npm run serve
```

## How do I add a linter to a Viage project?
* Open a command line in your project
* ```npm install --save-dev tslint```
* ```npx tslint --init```
* Add the following to your package.json scripts section:
```Javascript
    "lint": "tslint -c tslint.json 'src/**/*.ts'"
```
* Now whenever you want to lint type: ``` npm run lint ```

## How do I change the favicon?
* Replace the favicon.png file in the src folder with your own 32x32 png image with the same name
* ```npm run build```

## How do I add Font Awesome to a Viage project?
* Open a command line in your project
* ``` npm install --save-dev @fortawesome/fontawesome-free ```
* Add the following to index.html somewhere in the head:
```Javascript
    <link rel="stylesheet" href="css/all.css">
```
* Install the webpack-copy plugin: ``` npm install --save-dev copy-webpack-plugin ```
* Now modify the webpack.common.js file to copy the appropriate font files to the dest folder. In production you will have to serve the font awesome assets that in the dist folder.
At the top of the file add:
```Javascript
const CopyWebpackPlugin = require('copy-webpack-plugin');
```
Under plugins add:
```Javascript
    new CopyWebpackPlugin([
      { from:'node_modules/@fortawesome/fontawesome-free/css/all.css', to: 'css/all.css' },
      { from:'node_modules/@fortawesome/fontawesome-free/webfonts/*', to: 'webfonts/',  flatten: 'true'},
    ])
```
* ```npm run start``` or ```npm run build```

## How do I add a webfont to Viage?
I am using examples from [https://fonts.google.com/](https://fonts.google.com/)

You have the choice of adding an import to the index.css style sheet:
```Javascript
    @import url('https://fonts.googleapis.com/css?family=Gaegu');
```

or you can add a style link in index.html. Usually somewhere under the head tag:
```Javascript
    <link href="https://fonts.googleapis.com/css?family=Gaegu" rel="stylesheet">
```

Follow the Font's directions for styling specific elements using the Font.
*Note that for the sake of this example I chose the Gaegu font. Substitute ```family=Gaegu``` with the font family you intend on using.*

## How do I add Bootstrap to a Viage project?
You can of course just add the files to index.html as outlined in [here](https://getbootstrap.com/docs/4.0/getting-started/introduction/).
If you want to embedd the code within bundle.js then do the following:

* Open a command line in your project
* ```npm install --save-dev jquery bootstrap```
* Add the following lines to the top of index.ts:
```Javascript
    import 'bootstrap/dist/css/bootstrap.min.css';
    import 'jquery/dist/jquery.min.js';
    import 'bootstrap/dist/js/bootstrap.bundle.js';
```
* npm run start

## How do I add a Javascript Library to a Viage project?
If it is hosted publically you can simply add a script tag in src/index.html . Example for jquery:
```Javascript
  <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"></script>
```

If you want to embed the library into bundle.js:
* Find the NPM module for the library and in a console in the projects directory type:
```
  npm install --save-dev <name of the npm library module>
```
*Where <name of the npm library module> is the npm module name. Example: ```jquery```*

* In the index.ts file import the javascript library. Example:
```Javascript
    import 'jquery/dist/jquery.min.js';
```

*You might have to open the module's folder in npm_modules to see what the directory structure is for the file your interested in importing*

## How do I add an Image to a Viage Project
Images can be loaded and bundled into bundle.js. When using the url-loader, if the image is less than 8k it is bundled and inlined using base64 encoding. If the image is bigger than 8K then it is hashed, renamed to the hash, and copied to to dist directory. References to that image in index.css files will be automatically altered to match the hashed file name. For Examples on how to do this see the (Viage Shopping List Demo app)[https://github.com/schlotg/viage-shopping-list]

Here are several ways you can get images into your Viage App:

* Specify the image in your HTML just like normally would. This will cause the browser to load it and you will get no benefits from the url-loader. However you will need to add some mechanism to copy the file into the dist directory on builds. Webpack provides a [file-copy plugin](https://webpack.js.org/plugins/copy-webpack-plugin/) to do just that. It will need to be installed and configured.

*Note that links to assets already served on another server will just work*

* Reference the file in index.css and add it to a style that can be applied to elements that need the image:

```css
    .logo-img {
        background-color: url("images/logo.png");
    }
```
In this case the images/logo.png will be automatically grabbed by the url loader and either inlined or copied to the dist folder with a hashed name. The references to this file in index.css will be updated to either the inlined file or to the new hashed name.

* Inject images into dynamically generated components directly. This is necessary when using images directly in a component's HTML strings. To make this work, import the image at the top of the file and then use the imported reference in the HTML string. In the example below, logo.png is imported into a variable called logo. logo is then used as a template parameter and assigned to the src attribute in an HTML img tag.

```Javascript
import { Component }from 'viage';
import * as logo from '../logo.png';

  export class Toolbar extends Component {
    constructor() {
      super('toolbar');
    }
    init() {
      this.setHTML(`
        <div class="toolbar">
            <img src="${logo.default}" width="32px"/>
         </div>
      `);
      return this;
    }
  }
```
If you need to adjust the image inlining setpoint, it can be found in webpack.common.js at this line:

```Javascript
    test: /\.(png|svg|jpg|gif)$/i,
    use: [ { loader: 'url-loader', options: { limit: 8192 } } ]
```
In this case everything below 8K is inlined and everything above will copied to the build directory and referenced.

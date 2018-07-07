# Viage FAQ

## How do I add a simple server, besides the webpack-development server, so I can test release builds without deploying
You can add a Node server quickly and easily to your project.
* Open a command line in your project
* ```npm install express```
* Create a file in your project called server.js and add the following code to it:
```Javascript
    const express = require('express');
    const app = express();
    app.use(express.static('dist')); // serve the dist/ folder statically
    app.listen(3000, () => console.log('listening on port 3000!, http:://localhost:3000/'));
```
* Save the file
* ``` npm run build && node server ```
* Open [http://localhost:3000/](http://localhost:3000/) in your browser

## How do I add a linter to a Viage project?
* Open a command line in your project
* ```npm install --save-dev tslint```
* ```npx tslint --init```
* Add the following to your pacakge.json scripts section:
```Javascript
    "lint": "tslint -c tslint.json 'src/**/*.ts'"
```
* Now whenever you want to lint type: ``` npm run lint ```

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

If you want to embeed the library into bundle.js:
* Find the a Npm install project for the library and in a console in the projects directory type:
```
  npm install --save-dev <name of the npm library module>
```
*Where <name of the npm library module> is the npm module name. Example: ```jquery```*

* In the index.ts file import the javascript library. Example:
```Javascript
    import 'jquery/dist/jquery.min.js';
```

*You might have to open the module's folder in npm_modules to see what the directory structure is to the file your interested in importing*

## How do I add a test framework to Viage?
Coming Soon



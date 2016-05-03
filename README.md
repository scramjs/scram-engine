# What is this?
ScramJS offers a simple way to use web components to write server-side code. If you have not heard of web components, then please [start learning today](http://webcomponents.org/). Web components offer a way to modularize and package functionality into reusable components that can be easily shared and composed to create entire applications. Currently they have been used mostly for front-end web development. Well, what about the back-end? Web components are not only useful for visual components, as the [Google Polymer project](https://www.polymer-project.org/1.0/) has shown us. Now you can build APIs and other server-side applications, leveraging the same declarativeness of the front-end world. 

## Server-side Web Components
This repo only offers access to the runtime necessary to use server-side web components. To actually begin building applications, you'll need components to work with:

* Express Web Components: https://github.com/scramjs/express-web-components

## Examples
Here are some example Express apps that have been rewritten with web components:

## Development Installation
ScramJS leverages Electron to provide a runtime for server-side web components. The only dependency is Electron and Node.js, and you are free to install any compatible version: 

`npm install electron-prebuilt`

## Production Installation
TODO explain the need for xvfb, and offer help with the electron-prebuilt libraries that might be missing

## Usage
Provide Electron with the main.js script from this repo and then the path to your starting html file:

`electron node_modules/scram-engine/main.js index.html`

It might be convenient to create a script in your package.json:

```
{
  "name": "awesome-repo",
  "version": "2.4.2",
  "scripts": {
    "start": "electron main.js index.html"
  }
}
````

To enable logging to the console from any scripts called from your html file, include the following script in your html file before all other scripts that will log to the console:

`<script src="node_modules/scram-engine/logging.js"></script>`

## Compatibility and Testing
Currently only tested manually with Node.js v6.0.0 and electron-prebuilt v0.37.8.

Node.js is a trademark of Joyent, Inc. and is used with its permission. We are not endorsed by or
affiliated with Joyent.

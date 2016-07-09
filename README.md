# What is this?
Scram.js offers a simple way to use Electron as a server, allowing you to use HTML, Web APIs, and virtually any other client-side tool to write server-side applications. The recommended way to write these server-side applications is to use web components. If you have not heard of web components, then please [start learning today](http://webcomponents.org/). Web components offer a way to modularize and package functionality into reusable components that can be easily shared and composed to create entire applications. Currently they are used mostly for front-end web development. Well, what about the back-end? Web components are not only useful for visual components, as the [Google Polymer project](https://www.polymer-project.org/1.0/) has shown us. Now you can build APIs and other server-side applications, leveraging the same declarativeness of the front-end world. We are one step closer to true Universal JavaScript.

## Server-side Web Components
This repo only offers access to the runtime necessary to use server-side web components. To actually begin building applications, you'll need components to work with:

* Express Web Components: https://github.com/scramjs/express-web-components

## Examples
Here are some example Express.js apps that have been rewritten with web components:
* https://github.com/scramjs/rest-api-express
* https://github.com/scramjs/node-api
* https://github.com/scramjs/node-todo
* https://github.com/scramjs/node-tutorial-2-restful-app
* https://github.com/scramjs/node-tutorial-for-frontend-devs

## Development Installation
Scram.js leverages Electron to provide a runtime for server-side web components. The only dependency is Electron and Node.js, and you are free to install any compatible version: 

```
npm install --save electron-prebuilt
npm install --save scram-engine
```

## Production Installation
There are a few more considerations in a production environment. Since Electron needs a graphical environment for rendering on headless Linux® machines, you may need to install Xvfb to provide a display server.

On Ubuntu: `sudo apt-get install xvfb`

Electron might require one or more of the following libraries to be installed on certain Ubuntu systems: 

```
libgtk2.0-0
libnotify-bin
Libgconf-2-4
libxss1
```

### Dokku
Scram.js works well with [Dokku](http://dokku.viewdocs.io/dokku/). Dokku provides a personal PaaS, making it easy to deploy to a production environment.
* Follow the [official documentation](http://dokku.viewdocs.io/dokku/installation/) to install Dokku
* Install this [Dokku plugin](https://github.com/F4-Group/dokku-apt) to allow Dokku to automatically install Xvfb and other packages your application might need
* Add a file to the root directory of your app called `apt-packages`
* List the packages you would like Dokku to install: e.g. xvfb libgtk2.0-0 libnotify-bin Libgconf-2-4 libxss1
* Ensure that dependencies are listed correctly in your app's package.json
* Add a `start` script in your app's package.json for Dokku to use to start your application
* Add an `engines` property to your app's package.json to specify the version of node Dokku will use to run your app
* For a full working example of an application deployed with Dokku, see the [Dokku Example](https://github.com/scramjs/dokku-example)

## Usage
### Development
Provide Electron with the main.js script from this repo and then the path to your starting `html` file from the root directory of your app:

`node_modules/.bin/electron node_modules/scram-engine/main.js index.html`

It might be convenient to create a script in your package.json:

```
{
  "name": "awesome-repo",
  "version": "2.4.2",
  "scripts": {
    "start": "electron node_modules/scram-engine/main.js index.html"
  }
}
```

To open up an Electron window for access to the dev tools, add the `-d` option:

`node_modules/.bin/electron node_modules/scram-engine/main.js index.html -d`

or

```
{
  "name": "awesome-repo",
  "version": "2.4.2",
  "scripts": {
    "start": "electron node_modules/scram-engine/main.js index.html -d"
  }
}
```

### Production
You need to add the xvfb-run command in front of all other commands on headless Linux machines:

`xvfb-run node_modules/.bin/electron node_modules/scram-engine/main.js index.html`

If you are using bower to install the Polymer library and other web components (you probably are), you need your development server's build process to install the bower components when deploying:

`npm install -g bower && bower install`

It might be convenient to create a script in your package.json:

```
{
  "name": "awesome-repo",
  "version": "2.4.2",
  "scripts": {
    "start": "npm install -g bower && bower install && xvfb-run electron node_modules/scram-engine/main.js index.html",
    "dev": "electron node_modules/scram-engine/main.js index.html",
    "dev-window": "electron node_modules/scram-engine/main.js index.html -d"
  },
  "engines": {
    "node": "6.0.0"
  }
}
````

### Special Considerations

#### Loading Start File
It is important to understand the two different ways in which your starting `html` file is loaded into Electron, as each has subtle differences in behavior:

##### Local Server
By default, unless you add the `-f` option when starting the application, the specified starting `html` file is loaded into an Electron BrowserWindow from a local `http` server running on the following address: 0.0.0.0:5050. The port can be changed with the `-p` option. Loading the starting `html` file from a local server allows your server-side application to emulate a client-side application more faithfully. For example, client-side requests that rely on the protocol of their environment will have the protocol set to `http` and the domain to `localhost`, making life much easier than trying to do the same thing with the protocol set to `file`.

Loading the starting `html` file from a local server will cause `__dirname` and `__filename` to be incorrect for any web components included from your starting `html` file. You must include `filesystem-config.js` before any code that relies on `__dirname` or `__filename` to correct those issues.

##### Filesystem
The `-f` option will allow you to load your starting `html` file from the filesystem. Be aware that this may cause issues if you are using client-side code because the protocol is set to `file`.

##### Require
Any relative requires should be done relative to the starting `html` file when requiring from within an imported web component. When requiring from within a required module, relative requires should be done relative to the module (normal require behavior).

##### `__dirname` and `__filename`
`__dirname` and `__filename` are set relative to the starting `html` file, and should be the same across all components imported throughout your application. `__dirname` referenced directly from a web component script will be set to the absolute path of the directory that your starting `html` file resides in. `__filename` referenced directly from a web component script will be set to the absolute path of the starting `html` file, including that file's name.

`__dirname` and `__filename` inside of required modules act as expected.

When loading the starting `html` file from the local server, you must include the `filesystem-config.js` file before referencing `__dirname` or `__filename` in any imported web components:

```
<script src="node_modules/scram-engine/filesystem-config.js"></script>
```

Do not include this file when loading the starting `html` file from the filesystem.

### Options
There are various options available when loading your application:

* `-d`: Open a browser window for debugging
* `-f`: Load the starting `html` file from the filesystem
* `-p`: Specify the port the local server uses to load the starting `html` file

## Compatibility and Testing
Only manually tested at the moment. PR with tests if you'd like :)

Node.js is a trademark of Joyent, Inc. and is used with its permission. We are not endorsed by or
affiliated with Joyent.

Linux® is the registered trademark of Linus Torvalds in the U.S. and other countries.

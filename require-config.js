const path = require('path');
//const appNodeModulesRoot = path.resolve(__dirname, '../../../../../'); //TODO this relative path is subject to breaking if Electron changes its paths
//require('module').globalPaths.push(appNodeModulesRoot);

// process.env.NODE_PATH = path.resolve(__dirname, '../../../../../../app/server/models');
// console.log(process.env.NODE_PATH);
// require('module').Module._initPaths();

//console.log(path.resolve(__dirname, '../../../../../../'));
//__dirname = path.resolve(__dirname, '../../../../../../');

//const appRoot = path.resolve(__dirname, '../../../../../../');
//const oldRequire = require;

// const remote = require('electron').remote;
// global.require = function(name) {
//     console.log(name);
//     console.log('theModule before');
//     const theModule = remote.getCurrentWindow().requireModule(name);
//     console.log('theModule after', theModule);
//     //const theModule = remote.require(name);
//     return theModule;
//     //return require('remote').require(name);
//     // console.log(path.resolve(name));
//     // const newPath = path.resolve(appRoot + name);
//     // return oldRequire(newPath);
// };

// const remote = require('electron').remote;
//
// global.require = function(name) {
//     return remote.getCurrentWindow().captureRequire(name);
// };


const filename = require('electron').remote.getCurrentWindow().getFilename();

const appNodeModulesRoot = path.resolve(__dirname, '../../', 'node_modules');
require('module').globalPaths.push(appNodeModulesRoot);

const oldRequire = require;
global.require = function(name) {
    const modifiedName = (name) => {
        if (name.startsWith('.')) {
            const modifiedName = path.resolve(__dirname, '../../', filename.split('/').slice(0, -1).join('/'), name);
            return modifiedName;
        }

        return name;
    };

    return oldRequire(modifiedName(name));
};

const scramPathModule = require('path');

const filename = require('electron').remote.getCurrentWindow().getFilename();

const appNodeModulesRoot = scramPathModule.resolve(__dirname, '../../', 'node_modules');
require('module').globalPaths.push(appNodeModulesRoot);

const scramOldRequire = require;
global.require = function(name) {
    return scramOldRequire(modifiedName(name));
};

function modifiedName(name) {
    if (name.startsWith('.')) {
        const modifiedName = scramPathModule.resolve(__dirname, '../../', filename.split('/').slice(0, -1).join('/'), name);
        return modifiedName;
    }

    return name;
}

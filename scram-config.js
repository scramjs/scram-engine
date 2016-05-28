const path = require('path');

const appNodeModulesRoot = path.resolve(__dirname, '../../../../../'); //TODO this relative path is subject to breaking if Electron changes its paths

require('module').globalPaths.push(appNodeModulesRoot);

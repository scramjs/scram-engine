const scramPathModule = require('path');

const filename = require('electron').remote.getCurrentWindow().getFilename();

__dirname = scramPathModule.resolve(__dirname, '../../../../../../', filename.split('/').slice(0, -1).join('/')); //TODO this path is possibly subject to change if Electron changes its file structure
__filename = scramPathModule.resolve(__dirname, '../../../', filename); //TODO this path is possibly subject to change if Electron changes its file structure

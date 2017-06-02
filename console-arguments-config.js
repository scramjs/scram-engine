const {ipcRenderer} = require('electron');

const arguments = ipcRenderer.sendSync('get-console-arguments');

window.ELECTRON_CONSOLE_ARGUMENTS = arguments;

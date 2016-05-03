const ipcRenderer = require('electron').ipcRenderer;

//TODO get this to work for all console methods and any number of parameters
console.log = (...theArgs) => {
    ipcRenderer.send('asynchronous-message', ...theArgs);
};

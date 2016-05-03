const ipc = require('ipc');

//TODO get this to work for all console methods and any number of parameters
window.console.log = (...theArgs) => {
    ipc.send('asynchronous-message', ...theArgs);
};

const ipc = electron.ipcMain;

//TODO get this to work for all console methods and any number of parameters
console.log = (...theArgs) => {
    ipc.send('asynchronous-message', ...theArgs);
};

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow = null;

app.on('ready', () => {
        console.log('hello');
        mainWindow = new BrowserWindow({show:false});
        console.log('before call to loadURL');
        mainWindow.loadURL(`file://${__dirname}/index.html`);
        console.log('after call to loadURL');
});

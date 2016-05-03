#!/usr/bin/env node

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;

const filename = process.argv[2] || 'index.html';
const filepath = __dirname + '/' + filename; //development filepath from the scram-engine repo
//const filepath = __dirname.split('/').slice(0, -2).join('/') + '/' + filename; //production filepath from the consumer repo (assumes first level of node_modules directory from root of repo)

let mainWindow = null;

app.on('ready', () => {
        mainWindow = new BrowserWindow({show:false});
        console.log('before call to loadURL');
        mainWindow.loadURL(`file://${filepath}`);
        console.log('after call to loadURL');
});

ipc.on('asynchronous-message', (e, ...args) => {
    console.log(...args);
});

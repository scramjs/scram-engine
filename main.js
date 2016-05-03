#!/usr/bin/env node

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;

const filename = process.argv[2] || 'index.html';
//TODO figure out a more generally applicable way of getting the filepath. Also, eventually it might be nice if the user could do an npm script like this: scram-engine index.html
//const filepath = __dirname + '/' + filename; //development filepath from the scram-engine repo
const filepath = __dirname.split('/').slice(0, -2).join('/') + '/' + filename; //production filepath from the consumer repo (assumes first level of node_modules directory from root of repo)

let mainWindow = null;

app.on('ready', () => {
        mainWindow = new BrowserWindow({show:false});
        mainWindow.loadURL(`file://${filepath}`);
});

ipcMain.on('asynchronous-message', (e, ...args) => {
    console.log(...args);
});

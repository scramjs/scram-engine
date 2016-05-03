#!/usr/bin/env node

const filename = process.argv[2] || 'index.html';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;

let mainWindow = null;

app.on('ready', () => {
        mainWindow = new BrowserWindow({show:false});
        console.log('before call to loadURL');
        mainWindow.loadURL(`file://${__dirname}/${filename}`);
        console.log('after call to loadURL');
});

ipc.on('asynchronous-message', (e, ...args) => {
    console.log(...args);
});

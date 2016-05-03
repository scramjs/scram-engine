#!/usr/bin/env node

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;

//const filename = process.argv[2] || 'index.html';
//const filePath = __dirname + '/' + filename;
//const filePath = __dirname.split('/').slice(0, -2).join('/') + '/' + filename;

//console.log(filePath);

let mainWindow = null;

app.on('ready', () => {
        mainWindow = new BrowserWindow({show:false});
        console.log('before call to loadURL');
        //mainWindow.loadURL(`file://${__dirname}/${filename}`);
        mainWindow.loadURL(`file://${__dirname}/index.html`);
        //console.log(`file://${__dirname}/${filename}`);
        console.log('after call to loadURL');
});

ipc.on('asynchronous-message', (e, ...args) => {
    console.log(...args);
});

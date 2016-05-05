#!/usr/bin/env node

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;

const filename = process.argv[2];
const devMode = process.argv[3] === '-d' ? true : false;
const filepath = __dirname.split('/').slice(0, -2).join('/') + '/' + filename;

let mainWindow = null;

app.on('ready', () => {
        mainWindow = new BrowserWindow({
            show: devMode
        });
        mainWindow.loadURL(`file://${filepath}`);

        if (devMode) {
            mainWindow.webContents.openDevTools();
        }
});

ipcMain.on('asynchronous-message', (e, ...args) => {
    console.log(...args);
});

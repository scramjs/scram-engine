#!/usr/bin/env node

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;

const argOptions = process.argv.slice(3);

const filename = process.argv[2];
const devMode = argOptions.includes('-d') ? true : false;

const protocol = 'http';
const domain = 'localhost';
const port = ':5001';

const startLocalServer = () => {
    require('child_process').exec(`node_modules/.bin/http-server -p 5001`, (err, stdout, stderr) => {
        if (!err) {
            console.log(stdout);
        }
        else {
            console.log(stderr);
        }
    });
};

const launchApp = () => {
    let mainWindow = null;

    app.on('ready', () => {
            mainWindow = new BrowserWindow({
                show: devMode
            });

            mainWindow.loadURL(`${protocol}://${domain}${port}/${filename}`);

            if (devMode) {
                mainWindow.webContents.openDevTools();
            }
    });

    ipcMain.on('asynchronous-message', (e, ...args) => {
        console.log(...args);
    });
};

startLocalServer();
launchApp();

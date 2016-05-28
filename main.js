#!/usr/bin/env node

const getIndexURL = (loadFromFile, filename) => {

    const createFileURL = (filename) => {
        return `file://${__dirname}/${filename}`;
    };

    const createServerURL = (filename) => {
        const protocol = 'http';
        const domain = 'localhost';
        const port = ':5001/';

        return `${protocol}://${domain}${port}${filename}`;
    };

    if (loadFromFile) {
        return createFileURL(filename);
    }
    else {
        return createServerURL(filename);
    }
};

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

const launchApp = (indexURL, devMode) => {
    const electron = require('electron');
    const app = electron.app;
    const BrowserWindow = electron.BrowserWindow;
    const ipcMain = electron.ipcMain;

    let mainWindow = null;

    app.on('ready', () => {
            mainWindow = new BrowserWindow({
                show: devMode
            });

            mainWindow.loadURL(indexURL);

            if (devMode) {
                mainWindow.webContents.openDevTools();
            }
    });

    ipcMain.on('asynchronous-message', (e, ...args) => {
        console.log(...args);
    });
};

const init = () => {
    const argOptions = process.argv.slice(3);
    const filename = process.argv[2];
    const devMode = argOptions.includes('-d');
    const loadFromFile = argOptions.includes('-f');

    if (!loadFromFile) {
        startLocalServer();
    }
    
    launchApp(getIndexURL(loadFromFile, filename), devMode);
};

init();

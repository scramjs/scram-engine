#!/usr/bin/env node

const getIndexURL = (loadFromFile, filename, localPort) => {

    const createFileURL = (filename) => {
        const path = require('path');
        const resolvePath = path.resolve(__dirname, '../../');
        return `file://${path}/${filename}`;
    };

    const createServerURL = (filename, localPort) => {
        const protocol = 'http';
        const domain = 'localhost';
        const port = `:${localPort}/`;

        return `${protocol}://${domain}${port}${filename}`;
    };

    if (loadFromFile) {
        return createFileURL(filename);
    }
    else {
        return createServerURL(filename, localPort);
    }
};

const startLocalServer = (localPort) => {
    require('child_process').exec(`node_modules/.bin/http-server -p ${localPort}`, (err, stdout, stderr) => {
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

    app.commandLine.appendSwitch('--disable-http-cache');

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
    const localPort = argOptions.includes('-p') ? argOptions[argOptions.indexOf('-p') + 1] : '5050';

    if (!loadFromFile) {
        startLocalServer(localPort);
    }

    launchApp(getIndexURL(loadFromFile, filename, localPort), devMode);
};

init();

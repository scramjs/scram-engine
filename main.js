#!/usr/bin/env node

const getIndexURL = (loadFromFile, filename, devPort) => {

    const createFileURL = (filename) => {
        return `file://${__dirname}/${filename}`;
    };

    const createServerURL = (filename, devPort) => {
        const protocol = 'http';
        const domain = 'localhost';
        const port = `:${devPort}/`;

        return `${protocol}://${domain}${port}${filename}`;
    };

    if (loadFromFile) {
        return createFileURL(filename);
    }
    else {
        return createServerURL(filename, devPort);
    }
};

const startLocalServer = (devPort) => {
    require('child_process').exec(`cd ../../ && scramjs/scram-engine/node_modules/.bin/http-server -p ${devPort}`, (err, stdout, stderr) => {
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
    const devPort = argOptions.includes('-p') ? argOptions[argOptions.indexOf('-p') + 1] : '5050';

    if (!loadFromFile) {
        startLocalServer(devPort);
    }

    launchApp(getIndexURL(loadFromFile, filename, devPort), devMode);
};

init();

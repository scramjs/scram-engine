#!/usr/bin/env node

const path = require('path');

const getIndexURL = (loadFromFile, filename, localPort) => {

    const createFileURL = (filename) => {
        const resolvePath = path.resolve(__dirname, '../../');
        return `file://${resolvePath}/${filename}`;
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

const launchApp = (indexURL, filename, devMode, loadFromFile) => {
    const electron = require('electron');
    const app = electron.app;
    const BrowserWindow = electron.BrowserWindow;
    const ipcMain = electron.ipcMain;

    app.commandLine.appendSwitch('--disable-http-cache');

    let mainWindow = null;

    app.on('ready', () => {

        const getPreload = (loadFromFile) => {
            if (loadFromFile) {
                return path.resolve(__dirname, `index-config.js`);
            }
            else {
                return '';
            }
        };

        mainWindow = new BrowserWindow({
            show: devMode,
            webPreferences: {
                preload: getPreload(loadFromFile)
            }
        });

        mainWindow.getFilename = () => {
            return filename;
        };

        // mainWindow.getConsoleLog = () => {
        //     return console.log;
        // };

        mainWindow.loadURL(indexURL);

        if (devMode) {
            mainWindow.webContents.openDevTools();
        }
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

    launchApp(getIndexURL(loadFromFile, filename, localPort), filename, devMode, loadFromFile);
};

init();

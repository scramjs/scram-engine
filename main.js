#!/usr/bin/env node

const electron = require('electron');
const path = require('path');

const argOptions = process.argv.slice(3);
const filename = process.argv[2];
const devMode = argOptions.includes('-d');
const loadFromFile = argOptions.includes('-f');
const localPort = argOptions.includes('-p') ? argOptions[argOptions.indexOf('-p') + 1] : '5050';

if (!loadFromFile) {
    startLocalServer(localPort);
}

launchApp(getIndexURL(loadFromFile, filename, localPort), filename, devMode, loadFromFile);

function launchApp(indexURL, filename, devMode, loadFromFile) {
    const app = electron.app;
    const BrowserWindow = electron.BrowserWindow;
    const ipcMain = electron.ipcMain;

    let mainWindow = null;

    app.on('ready', () => {

        mainWindow = new BrowserWindow({
            show: devMode,
            webPreferences: {
                preload: getPreload(loadFromFile)
            }
        });

        mainWindow.getFilename = () => {
            return filename;
        };

        const options = {
            extraHeaders: 'pragma: no-cache\n'
        };
        mainWindow.loadURL(indexURL, options);

        if (devMode) {
            mainWindow.webContents.openDevTools();
        }

        function getPreload(loadFromFile) {
            if (!loadFromFile) {
                return path.resolve(__dirname, `index-config.js`);
            }
            else {
                return '';
            }
        }
    });
}

function getIndexURL(loadFromFile, filename, localPort) {

    if (loadFromFile) {
        return createFileURL(filename);
    }
    else {
        return createServerURL(filename, localPort);
    }

    function createFileURL(filename) {
        const resolvePath = path.resolve(__dirname, '../../');
        return `file://${resolvePath}/${filename}`;
    }

    function createServerURL(filename, localPort) {
        const protocol = 'http';
        const domain = 'localhost';
        const port = `:${localPort}/`;

        return `${protocol}://${domain}${port}${filename}`;
    }
}

function startLocalServer(localPort) {
    require('child_process').exec(`node_modules/.bin/http-server -p ${localPort}`, (err, stdout, stderr) => {
        if (!err) {
            console.log(stdout);
        }
        else {
            console.log(stderr);
        }
    });
}

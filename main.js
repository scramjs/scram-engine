#!/usr/bin/env node

const electron = require('electron');
const path = require('path');
const spawn = require('child_process').spawn;
const program = require('commander');

program
    .version('0.4.5')
    .option('-e, --entry-file [entryFile]', 'The file to load into Electron')
    .option('-d, --serve-dir [serveDir]', 'The directory to serve local application files from')
    .option('-w, --window', 'Open an Electron window')
    .option('-f, --file-system', 'Serve local application files through the file system protocol')
    .option('-p, --port [port]', 'The port for the local application file server')
    .parse(process.argv);

const filename = program.entryFile;
const devMode = program.window || false;
const loadFromFile = program.fileSystem;
const localPort = program.port || 5050;
const serveDir = program.serveDir || '';

const indexURL = getIndexURL(loadFromFile, filename, localPort);
launchApp(indexURL, filename, devMode, loadFromFile, serveDir);

function launchApp(indexURL, filename, devMode, loadFromFile, serveDir) {
    const app = electron.app;
    const BrowserWindow = electron.BrowserWindow;
    const ipcMain = electron.ipcMain;

    let mainWindow = null;

    app.commandLine.appendSwitch('disable-http-cache');
    app.on('ready', () => {

        if (!loadFromFile) {
            startLocalServer(localPort, filename, serveDir).then(() => {
                launchWindow(mainWindow, BrowserWindow, devMode, loadFromFile, indexURL);
            }, (error) => {
                console.log(error);
            });
        }
        else {
            launchWindow(mainWindow, BrowserWindow, devMode, loadFromFile, indexURL);
        }
    });
}

function launchWindow(mainWindow, BrowserWindow, devMode, loadFromFile, indexURL) {
    mainWindow = new BrowserWindow({
        show: devMode,
        webPreferences: {
            preload: getPreload(loadFromFile),
            webSecurity: false
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
}

function getPreload(loadFromFile) {
    if (!loadFromFile) {
        return path.resolve(__dirname, `index-config.js`);
    }
    else {
        return '';
    }
}

function getIndexURL(loadFromFile, filename, localPort) {

    if (loadFromFile) {
        return createFileURL(filename);
    }
    else {
        return createServerURL(filename, localPort);
    }
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

function startLocalServer(localPort, filename, serveDir) {
    return new Promise((resolve, reject) => {
        const child = spawn(`${path.resolve(__dirname, '../')}/.bin/zwitterion-production`, [
            '--port', localPort
        ]);

        child.stdout.on('data', (chunk) => {
            if (chunk.toString().includes('NGINX listening on port')) {
                resolve();
            }
        });

        child.stderr.on('data', (chunk) => {
            console.log(chunk.toString());
        });
    });
}

#!/usr/bin/env node

const electron = require('electron');
const path = require('path');
const spawn = require('child_process').spawn;
const program = require('commander');
const {ipcMain} = require('electron');

program
    .version('0.6.0')
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
    let localServerProcess = null;

    app.setAppPath(path.resolve(__dirname, '../../', filename)); // this does the magic of allowing require to work properly from an HTML file loaded over HTTP
    app.commandLine.appendSwitch('disable-http-cache'); // there were some major issues with the cache not allowing changes to load properly on subsequent loads of the user's HTML app
    app.on('ready', async () => {

        if (!loadFromFile) {
            localServerProcess = await startLocalServer(localPort, filename, serveDir);
            mainWindow = launchWindow(BrowserWindow, devMode, loadFromFile, indexURL);
        }
        else {
            mainWindow = launchWindow(BrowserWindow, devMode, loadFromFile, indexURL);
        }
    });
    ipcMain.on('kill-all-processes', (event) => {
        localServerProcess.kill();
        process.exit();
    });
}

function launchWindow(BrowserWindow, devMode, loadFromFile, indexURL) {
    let mainWindow = new BrowserWindow({
        show: devMode,
        webPreferences: {
            webSecurity: false,
            experimentalFeatures: true //TODO remove this once CSS grid is enabled with Chrome 57, I did this to get CSS grid to work right now
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

    return mainWindow;
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
                resolve(child);
            }
        });

        child.stderr.on('data', (chunk) => {
            console.log(chunk.toString());
        });
    });
}

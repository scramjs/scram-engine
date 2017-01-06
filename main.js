#!/usr/bin/env node

const electron = require('electron');
const path = require('path');
const spawn = require('child_process').spawn;
const program = require('commander');

program
    .version('0.4.0')
    .option('-e, --entry-file [entryFile]', 'The file to load into Electron')
    .option('-d, --serve-dir [serveDir]', 'The directory to serve local application files from')
    .option('-w, --window', 'Open an Electron window')
    .option('-f, --file-system', 'Serve local application files through the file system protocol')
    .option('-p, --port', 'The port for the local application file server')
    .parse(process.argv);

const filename = program.entryFile;
const devMode = program.window;
const loadFromFile = program.fileSystem;
const localPort = program.port || 5050;
const serveDir = program.serveDir || '';

launchApp(getIndexURL(loadFromFile, filename, localPort), filename, devMode, loadFromFile, serveDir);

function launchApp(indexURL, filename, devMode, loadFromFile, serveDir) {
    const app = electron.app;
    const BrowserWindow = electron.BrowserWindow;
    const ipcMain = electron.ipcMain;

    let mainWindow = null;

    app.on('ready', () => {

        if (!loadFromFile) {
            startLocalServer(localPort, filename, serveDir).then(() => {

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
            }, (error) => {
                console.log(error);
            });
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

function startLocalServer(localPort, filename, serveDir) {
    return new Promise((resolve, reject) => {
        const child = spawn(`${path.resolve(__dirname, '../')}/.bin/zwitterion`, [
            serveDir ? '--serve-dir' : '', serveDir,
            '--port', localPort,
            '--http',
            '--write-files-off',
            '--not-found-redirect', filename
        ]);

        child.stdout.on('data', (chunk) => {
            if (chunk.toString().includes('zwitterion server listening on port')) {
                resolve();
            }
        });

        child.stderr.on('data', (chunk) => {
            console.log(chunk.toString());
        });
    });
}

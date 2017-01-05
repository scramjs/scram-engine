#!/usr/bin/env node

const electron = require('electron');
const path = require('path');
const spawn = require('child_process').spawn;

const argOptions = process.argv.slice(3);
const filename = process.argv[2];
const devMode = argOptions.includes('-d');
const loadFromFile = argOptions.includes('-f');
const localPort = argOptions.includes('-p') ? argOptions[argOptions.indexOf('-p') + 1] : '5050';

// if (!loadFromFile) {
//     startLocalServer(localPort).then(() => {
//         console.log("launch app")
//         launchApp(getIndexURL(loadFromFile, filename, localPort), filename, devMode, loadFromFile);
//     }, (error) => {
//         console.log(error);
//     });
// }
// else {
//     launchApp(getIndexURL(loadFromFile, filename, localPort), filename, devMode, loadFromFile);
// }

launchApp(getIndexURL(loadFromFile, filename, localPort), filename, devMode, loadFromFile);

function launchApp(indexURL, filename, devMode, loadFromFile) {
    console.log('launching app');
    const app = electron.app;
    const BrowserWindow = electron.BrowserWindow;
    const ipcMain = electron.ipcMain;

    let mainWindow = null;

    console.log("waiting for app to be ready")

    app.on('ready', () => {

        if (!loadFromFile) {
            startLocalServer(localPort).then(() => {
                console.log("app ready")
                mainWindow = new BrowserWindow({
                    show: devMode,
                    webPreferences: {
                        preload: getPreload(loadFromFile)
                    }
                });

                console.log('main window created');

                mainWindow.getFilename = () => {
                    return filename;
                };

                const options = {
                    extraHeaders: 'pragma: no-cache\n'
                };
                console.log(indexURL)
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

function startLocalServer(localPort) {
    return new Promise((resolve, reject) => {
        console.log(path.resolve(__dirname, '../..'))

        const child = spawn(`${path.resolve(__dirname, '../')}/.bin/zwitterion`, [
            '--serve-dir', path.resolve(__dirname, '../..').split('/').slice(-1)[0],
            '--port', localPort,
            '--http',
            '--write-files-off'
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

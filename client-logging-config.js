// const remote = require('electron').remote;
//
// const rendererProcessConsoleLog = window.console.log;
// const mainProcessConsoleLog = remote.getCurrentWindow().getConsoleLog();
// window.console.log = () => {
//     //rendererProcessConsoleLog(arguments);
//     //rendererProcessConsoleLog('hello');
//     //mainProcessConsoleLog('hello');
// };

const scramRedirectModule = require('console-redirect');
redirect(process.stdout, process.stderr);

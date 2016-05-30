const remote = require('electron').remote;

window.console.log = remote.log;

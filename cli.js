#!/usr/bin/env node
var exec = require('child_process').exec;
var cmd = 'node_modules/.bin/electron-spawn main.js index.html';

var newProcess = exec(cmd);

newProcess.stdout.on('data', function(data) {
    console.log(data);
});

newProcess.stderr.on('data', function(data) {
    console.log(data);
});

#!/usr/bin/env node
var exec = require('child_process').exec;
var cmd = 'npm start';

var newProcess = exec(cmd);

newProcess.stdout.on('data', function(data) {
    console.log(data);
});

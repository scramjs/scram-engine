#!/usr/bin/env node
var exec = require('child_process').exec;
var cmd = 'cd node_modules/scram-engine && npm start';

var newProcess = exec(cmd);

newProcess.stdout.on('data', function(data) {
    console.log(data);
});

newProcess.stderr.on('data', function(data) {
    console.log(data);
});

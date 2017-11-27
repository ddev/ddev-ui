const childProcess = require('child_process');
const os = require('os');
const fixPath = require('fix-path');

fixPath();

const ddevShell = (command, args, path, callback, errorCallback, stream) => {
    var opts = {};

    if(!Array.isArray(command)) {
        command = [command];
    }

    if(args && Array.isArray(args)){
        command = command.concat(args);
    }

    if(path) {
        path = path.replace('~', os.homedir());
        opts = {
            cwd: path
        }
    }

    var currentCommand = childProcess.spawn('ddev', command, opts);

    var outputBuffer = '';

    var appendBuffer = function(data) {
        outputBuffer += data;
        if(stream) {
            callback(data);
        }
    };

    currentCommand.stdout.on('data', function(output) {
        appendBuffer(output);
    });

    currentCommand.stderr.on('data', function(output) {
        appendBuffer(output);
    });

    currentCommand.on('exit', function(code) {
        if(code !== 0) {
            errorCallback(outputBuffer);
        } else {
            if(stream){
                callback('Process Exited With Code ' + code);
            } else {
                callback(outputBuffer);
            }
        }
    });
};

const list = () => {
    var promise = new Promise((resolve, reject) => {
        function getRaw(output) {
            var outputObject = JSON.parse(output);
            if(Array.isArray(outputObject.raw)){
                resolve(outputObject.raw)
            } else {
                reject(output);
            }
        }
        ddevShell('list', ['-j'], null, getRaw, reject);
    });
    return promise;
};

const start = (path, callback, errorCallback) => {
    ddevShell('start', null, path, callback, errorCallback, true);
};

const stop = (path, callback, errorCallback) => {
    ddevShell('stop', null, path, callback, errorCallback, true);
};

const restart = (path, callback, errorCallback) => {
    ddevShell('restart', null, path, callback, errorCallback, true);
};

const remove = (path, callback) => {
    ddevShell('remove', null, path, callback, errorCallback, true);
};

const config = (path, name, docroot, callback, errorCallback) => {
    var opts = {};
    if (path) {
        path = path.replace('~', os.homedir());
        opts = {
            cwd: path
        }
    }

    var configCommand = childProcess.spawn('ddev', ['config'], opts);
    configCommand.stdout.on('data', function(output) {
        var outputStr = output.toString();
        if(outputStr.indexOf('Project name') !== -1){
            console.log('project name', name);
        }
        console.log(outputStr);
    });
    configCommand.stdin.write(name);
};

const describe = (siteName) => {
    var promise = new Promise((resolve, reject) => {
        function parseJSONOutput (describeJSON) {
            var rawData = JSON.parse(describeJSON);
            var siteDetails = rawData.raw;
            var modalData = {};
            if(siteDetails.dbinfo) {
                modalData['MySQL Credentials'] = siteDetails.dbinfo;
            }
            if(siteDetails.mailhog_url || siteDetails.phpmyadmin_url) {
                modalData['Other Services'] = {};
                if(siteDetails.mailhog_url) {
                    modalData['Other Services']['MailHog'] = "<a onclick=\"electron.shell.openExternal('"+siteDetails.mailhog_url+"')\" href=\"#\">"+siteDetails.mailhog_url+"</a>"
                }
                if(siteDetails.phpmyadmin_url) {
                    modalData['Other Services']['phpMyAdmin'] = "<a onclick=\"electron.shell.openExternal('"+siteDetails.phpmyadmin_url+"')\" href=\"#\">"+siteDetails.phpmyadmin_url+"</a>"
                }
            }
            resolve(modalData);
        }
        ddevShell('describe', [siteName, "-j"], null, parseJSONOutput, reject, false);
    });

    return promise;
};

module.exports.list = list;
module.exports.start = start;
module.exports.stop = stop;
module.exports.restart = restart;
module.exports.remove = remove;
module.exports.config = config;
module.exports.describe = describe;
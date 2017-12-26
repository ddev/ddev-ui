const childProcess = require('child_process');
const os = require('os');
const fixPath = require('fix-path');
const sudoPrompt = require('sudo-prompt');

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
            if(outputObject.msg === 'There are no running ddev applications.') {
                outputObject = {
                    raw: []
                }
            }
            if(Array.isArray(outputObject.raw)) {
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
    ddevShell('config', ['-j','--sitename', name, '--docroot', docroot], path, callback, errorCallback);
};

const hostname = (siteName, domain = 'ddev.local') => {
    var promise = new Promise(function(resolve, reject){
        var options = {
            name: 'DDEV UI',
        };

        var command = 'ddev hostname '+siteName+'.'+domain+' 127.0.0.1 -j';
        sudoPrompt.exec(command, options,
            function(error, stdout, stderr) {
                if (error) {
                    reject(error);
                }else{
                    resolve(stdout);
                }
            }
        );
    });
    return promise;
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

const sudo = (command, options = {name: 'DDEV UI'}) => {
    var bannedCharacters = [';','|','&'];
    var whitelistedCommands = ['version'];
    if(whitelistedCommands.indexOf(command) != -1){
        bannedCharacters.forEach(function(character){
            if(command.includes(character)){
                return Promise.reject(character + ' is not an allowed character in privilege escalation requests.');
            }
        });
        command = 'ddev ' + command;
        var promise = new Promise((resolve, reject) => {
            sudoPrompt.exec(command, options,
                function(error, stdout, stderr) {
                    if (error) {

                        reject('Unable to escalate permissions.');
                    }else{
                        resolve(stdout);
                    }
                }
            );
        });

        return promise;
    } else {
        return Promise.reject(command + ' is not allowed to be run as sudo');
    }
};

module.exports.list = list;
module.exports.start = start;
module.exports.hostname = hostname;
module.exports.stop = stop;
module.exports.restart = restart;
module.exports.remove = remove;
module.exports.config = config;
module.exports.describe = describe;
module.exports.sudo = sudo;
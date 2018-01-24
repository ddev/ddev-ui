const childProcess = require('child_process');
const os = require('os');
const fixPath = require('fix-path');
const sudoPrompt = require('sudo-prompt');

// quirk with electron's pathing. without this, / is symlinked to application working directory root
fixPath();

/**
 * executor for ddev shell commands. *only* allows `ddev *` commands to be run; autoprefixes commands.
 * i.e. command = 'list' -> command = 'ddev list'
 * @param command {string} - ddev command to run.
 * @param args {array} - optional - CLI arguments to pass with command.
 * @param path {string} - optional - working directory in which to run the command in
 * @param callback {function} - function to execute on stdout/completion
 * @param errorCallback {function} - function to execute or error
 * @param stream {bool} - if true, success callback will be called with every update to stdout.
 */
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

/**
 * wrapper for `ddev list` - parses array of site objects from raw or returns empty array if none
 * @returns {Promise} - resolves with an array of sites, or an empty array if none found
 */
const list = () => {
    var promise = new Promise((resolve, reject) => {
        function getRaw(output) {
            var outputObject = JSON.parse(output);
            if(outputObject.level === 'info' && !outputObject.raw) {
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

/**
 * wrapper for `ddev start`
 * @param path {string} - path to execute command in
 * @param callback {function} - function called on stdout update
 * @param errorCallback {function} - function called on error
 */
const start = (path, callback, errorCallback) => {
    ddevShell('start', null, path, callback, errorCallback, true);
};

/**
 * wrapper for `ddev stop`
 * @param path {string} - path to execute command in
 * @param callback {function} - function called on stdout update
 * @param errorCallback {function} - function called on error
 */
const stop = (path, callback, errorCallback) => {
    ddevShell('stop', null, path, callback, errorCallback, true);
};

/**
 * wrapper for `ddev restart`
 * @param path {string} - path to execute command in
 * @param callback {function} - function called on stdout update
 * @param errorCallback {function} - function called on error
 */
const restart = (path, callback, errorCallback) => {
    ddevShell('restart', null, path, callback, errorCallback, true);
};

/**
 * wrapper for `ddev remove`
 * @param name {string} - name of site to remove
 * @param shouldRemoveData {boolean} - if data should be removed as well as project containers
 */
const remove = (name, shouldRemoveData) => {
		var args = shouldRemoveData ? ['-j', '--remove-data'] : ['-j'];
		args.push(name);
    var promise = new Promise(function(resolve, reject) {
        ddevShell('remove', args, '', resolve, reject, false);
    });
    return promise;
};

/**
 * wrapper for `ddev config`, run with --sitename --docroot flags to prevent cli from prompting
 * @param path {string} - working directory of project to configure
 * @param name {string} - name of newly created site
 * @param docroot {string} - docroot of target project
 * @param callback {function} - function to call on execution completion
 * @param errorCallback - function to call on failure
 */
const config = (path, name, docroot, callback, errorCallback) => {
    ddevShell('config', ['-j','--sitename', name, '--docroot', docroot], path, callback, errorCallback);
};

/**
 * wrapper for `ddev hostname`, attempts to run as sudo
 * @param siteName {string} - sitename to create hostname entry for
 * @param domain - optional - domain to create sitename subdomain
 * @returns {Promise} - resolves on successful execution with stdout text
 */
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

/**
 * wrapper for `ddev describe` and formats output (creates links) as needed by the UI
 * @param siteName {string} - target site to get details of
 * @returns {Promise} - resolves with object containing formatted links and sections for the UI
 */
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

/**
 * priv escalation - only allows whitelisted commands to be run as sudo, and bans dangerous characters
 * @param command {string} - ddev command to run
 * @param promptOptions {object} - sudo prompt options such as application name and prompt icon
 * @returns {promise} - resolves if escalation is successful with stdout text
 */
const sudo = (command, promptOptions = {name: 'DDEV UI'}) => {
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
            sudoPrompt.exec(command, promptOptions,
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

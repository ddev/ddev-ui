const childProcess = require('child_process');
const os = require('os');
const fixPath = require('fix-path');

fixPath();

const ddevShell = (command, args, path, callback, stream, complete) => {
    if(!complete){
        complete = {
            success: function(){},
            fail: function(){}
        }
    }
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
        if(stream) {
            callback(data);
        } else {
            outputBuffer += data;
        }
    };

    currentCommand.stdout.on('data', function(output) {
        appendBuffer(output);
    });

    currentCommand.stderr.on('data', function(output) {
        appendBuffer(output);
    });

    currentCommand.on('close', function(code) {
        if(code === 0) {
            callback(outputBuffer);
            complete.success();
        } else{
            complete.fail(code);
        }
    });
};

const list = () => {
    var promise = new Promise((resolve, reject) => {
        function createSiteFromLine(lineText){
            var lineArray = lineText.replace(/\s\s+/g,'!~!').split('!~!');
            var site = {
                name:  lineArray[0],
                type:  lineArray[1],
                path:  lineArray[2],
                url:   lineArray[3],
                state: lineArray[4]
            };
            return site;
        }

        function parseLines(shellOutput) {
            var sitesList = [];
            var linesArray = shellOutput.replace(/\n/g, '!~!').split('!~!');
            var loopInSitesBlock = false;
            linesArray.forEach(function(line) {
                if(loopInSitesBlock && line){
                    sitesList.push(createSiteFromLine(line));
                }

                if(line.replace(/\s\s+/g,'').indexOf('NAMETYPELOCATIONURLSTATUS') != -1){
                    loopInSitesBlock = true;
                }else if(!line){
                    loopInSitesBlock = false;
                }
            });
            if(sitesList){
                resolve(sitesList);
            }else{
                reject('No Sites Found.');
            }
        }

        ddevShell('list', null, null, parseLines, false);
    });
    return promise;
};

const start = (path, callback, complete) => {
    ddevShell('start', null, path, callback, true, complete);
};

const stop = (path, callback, complete) => {
    ddevShell('stop', null, path, callback, true, complete);
};

const restart = (path, callback, complete) => {
    ddevShell('restart', null, path, callback, true, complete);
};

const remove = (path, preserveData, callback, complete) => {
    var args = '';
    if(!preserveData){
        args = ['--remove-data'];
    }
    ddevShell('remove', args, path, callback, true, complete);
};

const config = (path, name, docroot, callback) => {
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
    var pwd = childProcess.spawn('pwd');
    var ls = childProcess.spawn('ls');
    pwd.stdout.on('data', function(output) {
        console.log(output.toString());
    });
    ls.stdout.on('data', function(output) {
        console.log(output.toString());
    });
    var promise = new Promise((resolve, reject) => {
        function parseDesribeLines (shellOutput) {
            var siteDetails = {};
            var linesArray = shellOutput.replace(/\n/g, '!~!').split('!~!');
            var inSection = false;
            var currentSection = '';
            for(var i = 0; i < linesArray.length; i++){
                var currentLine = linesArray[i];

                if(inSection){
                    currentLine = currentLine.replace(/For example:\s/, 'For example:');
                    var results = currentLine.replace(/:\s/g,'!~!').split('!~!');
                    results.forEach(function(line,index){
                        results[index] = line.trim();
                    });
                    if(results.length > 1){
                        siteDetails[currentSection][results[0]] = results[1];
                    } else if (results.length === 1 && results[0]){
                        if(siteDetails[currentSection]['notes'] === undefined){
                            siteDetails[currentSection]['notes'] = [];
                        }
                        siteDetails[currentSection]['notes'].push(results[0]);
                    }
                }

                if(currentLine.indexOf('-----') != -1){
                    currentSection = linesArray[i-1];
                    siteDetails[currentSection] = {};
                    inSection = true;
                }else if(!currentLine){
                    currentSection = '';
                    inSection = false;
                }
            }
            console.log(siteDetails);
            resolve(siteDetails);
        }
        ddevShell('describe', [siteName], null, parseDesribeLines, false);
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
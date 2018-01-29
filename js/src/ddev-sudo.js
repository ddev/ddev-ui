var cmsInstaller = require('./cms-installer');

/**
 * execute a ddev command as sudo - only allows whitelisted commands and bans illegal characters in args
 * @param command {string} - command to execute. will be autoprefixed with 'ddev '. i.e. 'list' -> 'ddev list'
 * @param args {array} - array of arguments to apply to command. does not allow ; | & characters
 * @returns {promise} - resolves with stdout text if successful, rejects with specific reason why or generic catchall.
 */
function sudoHostname(fullDomain, domainUrl = '127.0.0.1') {
    var promise = new Promise(function(resolve, reject){
        cmsInstaller.validateHostname(fullDomain)
            .then(function(){
                var command = "ddev hostname " + fullDomain + " " + domainUrl + " -j";
                executeSudo(command)
                    .then(function(output){
                        resolve(output);
                    })
                    .catch(function(err){
                        reject(err);
                    })
            })
            .catch(function(error){
                var errorMessage = error.includes('Blank') ? 'hostname cannot be blank' : fullDomain + " is an invalid hostname";
                reject(errorMessage);
            });
    });

    return promise;
}

function executeSudo(command){
    //locally scoping sudo-prompt require here will prevent the base sudo-prompt library from being called anywhere else
    var sudoPrompt = require('sudo-prompt');
    var promise = new Promise((resolve, reject) => {
        sudoPrompt.exec(command, {name: 'DDEV UI'},
            function (error, stdout, stderr) {
                if (error) {
                    reject('Unable to escalate permissions.');
                } else {
                    resolve(stdout);
                }
            }
        );
    });

    return promise;
}

module.exports.sudoHostname = sudoHostname;
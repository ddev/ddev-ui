function exec(command, args = [], promptOptions = {name: 'DDEV UI'}) {
    var sudoPrompt = require('sudo-prompt');

    var bannedCharacters = [';', '|', '&'];
    var whitelistedCommands = ['hostname'];
    if (whitelistedCommands.indexOf(command) !== -1) {
        command = command + ' ' + args.join(' ');
        command = 'ddev ' + command;

        var foundBannedCharacters = bannedCharacters.filter(function(bannedCharacter){
            return command.includes(bannedCharacter);
        });
        if(foundBannedCharacters.length > 0){
            return Promise.reject('arguments contain banned characters (' + foundBannedCharacters.join(',') +')');
        } else {
            var promise = new Promise((resolve, reject) => {
                sudoPrompt.exec(command, promptOptions,
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
    } else {
        return Promise.reject(command + ' is not allowed to be run as sudo');
    }
}

module.exports.exec = exec;
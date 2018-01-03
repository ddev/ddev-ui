/**
 * execute a ddev command as sudo - only allows whitelisted commands and bans illegal characters in args
 * @param command {string} - command to execute. will be autoprefixed with 'ddev '. i.e. 'list' -> 'ddev list'
 * @param args {array} - array of arguments to apply to command. does not allow ; | & characters
 * @param promptOptions {object} - sudo-prompt library options, such as name to display on username/pass prompt.
 * @returns {promise} - resolves with stdout text if successful, rejects with specific reason why or generic catchall.
 */
function exec(command, args = [], promptOptions = {name: 'DDEV UI'}) {
    //locally scoping sudo-prompt require here will prevent the base sudo-prompt library from being called anywhere else
    var sudoPrompt = require('sudo-prompt');

    var bannedCharacters = [';', '|', '&'];
    var whitelistedCommands = ['hostname'];

    //check if current command is whitelisted
    if (whitelistedCommands.indexOf(command) !== -1) {
        //prepend command with ddev, append arguments.
        command = 'ddev ' + command;
        command = command + ' ' + args.join(' ');

        //check if arguments have any banned characters
        var foundBannedCharacters = bannedCharacters.filter(function(bannedCharacter){
            return command.includes(bannedCharacter);
        });

        //reject if banned characters are found, otherwise safe to execute
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
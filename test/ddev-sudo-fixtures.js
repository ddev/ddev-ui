const whitelist = ['hostname'];
const badCommands = ['mv','wget','curl','rm','cp','command'];
const goodArguments = ['super.cool.site.ddev.local', '-j', '-l'];
const badArguments = ['&& ls', '| wc -c', '; pwd'];

const rejectCommandErrorMessage = ' is not allowed to be run as sudo';
const rejectArgumentsErrorMessage = 'arguments contain banned characters';

module.exports.whitelist = whitelist;

module.exports.badCommands = badCommands;
module.exports.rejectCommandErrorMessage = rejectCommandErrorMessage;

module.exports.goodArguments = goodArguments;
module.exports.badArguments = badArguments;
module.exports.rejectArgumentsErrorMessage = rejectArgumentsErrorMessage;
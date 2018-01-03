const fixtures = require('./ddev-sudo-fixtures');
const ddevSudo = require('../js/ddev-sudo');
const assert = require('assert');

describe('ddev-sudo', function () {
    describe('#exec', function () {
        it('should expose the filtered exec method of ddevSudo', function(){
            assert.equal(typeof(ddevSudo.exec), 'function');
        });
        it('should not expose the unfiltered sudo-prompt library', function(){
            let protected = (typeof(ddevSudo.sudoPrompt) === 'undefined' || (typeof(sudoPrompt) === 'undefined'));
            assert.equal(protected, true);
        });
        it('should reject any commands that are not whitelisted before attempting to execute', function (done) {
            function reflect(promise){
                return promise.then(function(v){ return {v:v, status: "resolved" }},
                    function(e){ return {e:e, status: "rejected" }});
            }

            var bannedCommands = fixtures.badCommands;
            var commandPromises = [];
            bannedCommands.forEach(function(command){
                commandPromises.push(ddevSudo.exec(command));
            });
            Promise.all(commandPromises.map(reflect)).then(function(results){
                var response = results.filter(result => result.e.includes(fixtures.rejectCommandErrorMessage));
                if(response.length === bannedCommands.length) {
                    done();
                } else {
                    console.log('Not all commands were rejected before attempting to execute.');
                }
            });
        });
        it('should reject any arguments that contain banned characters', function (done) {
            function reflect(promise){
                return promise.then(function(v){ return {v:v, status: "resolved" }},
                    function(e){ return {e:e, status: "rejected" }});
            }

            var allowedCommand = fixtures.whitelist[0];
            var badArguments = fixtures.badArguments;

            var commandPromises = [];
            badArguments.forEach(function(argument){
                commandPromises.push(ddevSudo.exec(allowedCommand, [argument]));
            });
            Promise.all(commandPromises.map(reflect)).then(function(results){
                var response = results.filter(result => result.e.includes(fixtures.rejectArgumentsErrorMessage));
                if(response.length === badArguments.length) {
                    done();
                } else {
                    console.log('Not all arguments with illegal characters were rejected before attempting to execute.');
                }
            });
        });
    });
});

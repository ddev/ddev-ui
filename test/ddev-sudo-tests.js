const fixtures = require('./ddev-sudo-fixtures');
const rewire = require('rewire');
const ddevSudo = rewire('../js/ddev-sudo');
const assert = require('assert');

describe('ddev-sudo', function () {
    describe('#exec', function () {
        it('should expose the filtered exec method of ddevSudo', function(){
            assert.equal(typeof(ddevSudo.sudoHostname), 'function');
        });
        it('should not expose the unfiltered sudo-prompt library', function(){
            let protected = (typeof(ddevSudo.sudoPrompt) === 'undefined' && (typeof(sudoPrompt) === 'undefined'));
            assert.equal(protected, true);
        });
        it('should reject the hostname if it does not conform to RFC 2396 Section 3.2.2', function(done){
            ddevSudo.sudoHostname(fixtures.invalidHostname)
                .then(function(msg){
                    console.log('Failed - expected promise to reject; resolved with ' + msg.toString());
                })
                .catch(function(err){
                    if(err === fixtures.invalidHostname + fixtures.rejectInvalidHostnameMessage);
                    done();
                })
        });
        it('should reject the hostname if it is blank', function(done){
            ddevSudo.sudoHostname('')
                .then(function(msg){
                    console.log('Failed - expected promise to reject; resolved with ' + msg.toString());
                })
                .catch(function(err){
                    if(err === fixtures.rejectBlankHostnameMessage);
                    done();
                })
        });
        it('should validate the hostname and succeed if it conforms to RFC 2396 Section 3.2.2', function(done){
            ddevSudo.__set__('executeSudo', function(hostname){
                done();
            });
            ddevSudo.sudoHostname(fixtures.validHostname);
        });
    });
});

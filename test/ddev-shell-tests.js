const fixtures = require('./ddev-shell-fixtures');

const ddevShell = require('../js/src/ddev-shell');
const {stubSpawnOnce} = require('stub-spawn-once');
const assert = require('assert');

describe('ddev-shell', function () {
    describe('#list()', function () {
        stubSpawnOnce('ddev list -j', 0, JSON.stringify(fixtures.validListOutput));
        it('should parse `ddev list` shell output and return an array of site objects', function () {
            return ddevShell.list().then(function fulfilled(result) {
                assert.equal(JSON.stringify(fixtures.expectedSitesArray), JSON.stringify(result));
            });
        });
    });
    describe('#start()', function () {
        stubSpawnOnce('ddev start', 0, fixtures.validStartOutput);
        it('should call the success callback if process exits with no issue', function (done) {
            ddevShell.start('~/', function(msg){
                if(msg.toString() === fixtures.validStartOutput) {
                    done();
                    stubSpawnOnce('ddev start', 1, fixtures.invalidStartOutput);
                }
            },function(){});
        });
        it('should call the error callback if process exits with a non 0 code', function(done) {
            ddevShell.start('~/', function(){},function(err){
                if(err === fixtures.invalidStartOutput) {
                    done();
                }
            });
        });
    });
    describe('#stop()', function () {
        stubSpawnOnce('ddev stop', 0, fixtures.validStopOutput);
        it('should call the success callback if process exits with no issue', function (done) {
            ddevShell.stop('~/', function(msg){
                if(msg.toString() === fixtures.validStopOutput) {
                    done();
                    stubSpawnOnce('ddev stop', 1, fixtures.invalidStopOutput);
                }
            },function(){});
        });
        it('should call the error callback if process exits with a non 0 code', function(done) {
            ddevShell.stop('~/', function(){},function(err){
                if(err === fixtures.invalidStopOutput) {
                    done();
                }
            });
        });
    });
    describe('#restart()', function () {
        stubSpawnOnce('ddev restart', 0, fixtures.validRestartOutput);
        it('should call the success callback if process exits with no issue', function (done) {
            ddevShell.restart('~/', function(msg){
                if(msg === "Process Exited With Code 0") {
                    done();
                    stubSpawnOnce('ddev restart', 1, fixtures.validStartOutput);
                }
            },function(){});
        });
        it('should call the error callback if process exits with a non 0 code', function(done) {
            ddevShell.restart('~/', function(){},function(){done()});
        });
    });
    describe('#describe()', function () {
        stubSpawnOnce('ddev describe drupaltest -j', 0, JSON.stringify(fixtures.validDescribeJSON));
        it('should parse `ddev describe drupaltest` shell output and return an object of site information', function () {
            return ddevShell.describe('drupaltest',function(){}).then(function fulfilled(result) {
                assert.equal(JSON.stringify(fixtures.expectedDescribeObject), JSON.stringify(result));
                stubSpawnOnce('ddev describe drupaltest -j', 1, fixtures.invalidDescribeOutput);
            });
        });
        it('should throw an error on error of ddev describe (expecting non 0 exit code)', function () {
            return ddevShell.describe('drupaltest')
                .then(function fulfilled(result) {
                    throw new Error('Promise was unexpectedly fulfilled. Result: ' + result);
                }, function rejected(error) {
                    assert(error === fixtures.invalidDescribeOutput);
                });
        });
    });
    describe('#remove()', function () {
        stubSpawnOnce('ddev remove -j', 0, fixtures.validRemoveOutput);
        it('should resolve the promise if it exits with no issue', function (done) {
            ddevShell.remove('~/', false)
                .then(function(){
                    stubSpawnOnce('ddev remove -j --remove-data', 0, fixtures.validRemoveDBOutput);
                    done();
                })
                .catch(function(err){
                    throw new Error('Promise rejected. error: ' + err);
                })
        });
        it('should pass the --remove-data flag to ddev cli if passed in', function (done) {
            ddevShell.remove('~/', true)
                .then(function(msg){
                    if(msg === fixtures.validRemoveDBOutput){
                        stubSpawnOnce('ddev remove -j', 1, fixtures.invalidRemoveOutput);
                        done();
                    }
                })
                .catch(function(err){
                    throw new Error('Promise rejected. error: ' + err);
                })
        });
        it('should call the error callback if process exits with a non 0 code', function(done) {
            ddevShell.remove('~/', false)
                .then(function (result) {
                    throw new Error('Promise was unexpectedly fulfilled. Result: ' + result);
                })
                .catch(function () {
                    done()
                })
        });
    });
});

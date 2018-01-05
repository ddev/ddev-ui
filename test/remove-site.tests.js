const fixtures = require('./remove-site-fixtures');
const rewire = require('rewire');
const remove_site = rewire('../js/remove-site');

describe('remove-site', function () {
    describe('#removeSite()', function () {
        var removeSite = remove_site.__get__('removeSite');
        remove_site.__set__('displayLoadingState', function(){});
        remove_site.__set__('removeCompleted', function(){});

        beforeEach(function() {
            remove_site.__set__('removeCompleted', function(){});
        });

        it('should call ddevShell module and attempt to exec `ddev remove` from path with no remove flag', function (done) {
            const mockShell = {
                remove: function(path,db){
                    return new Promise(function(resolve, reject){
                        if(path === '/Users/testguy777/Desktop/d7test1234' && db === false){
                            done();
                        } else{
                            console.log('Fail - Path and DB Removal flag did not get passed as expected!');
                        }
                        resolve();
                    });
                }
            };
            remove_site.__set__('ddevShell', mockShell);
            removeSite(fixtures.removeProjectArray);
        });
        it('should call ddevShell module and attempt to exec `ddev remove` from path with the remove db flag', function (done) {
            const mockShell = {
                remove: function(path,db){
                    return new Promise(function(resolve, reject){
                        if(path === '/Users/testguy777/Desktop/d87loihasd' && db === true){
                            done();
                        } else{
                            console.log('Fail - Path and DB Removal flag did not get passed as expected!');
                        }
                        resolve();
                    });
                }
            };
            remove_site.__set__('ddevShell', mockShell);
            removeSite(fixtures.removeProjectDataArray);
        });

        it('should throw an error if valid called with valid arguments, but remove is unsuccessful', function(done){
            const mockShell = {
                remove: function(path,db){
                    return new Promise(function(resolve, reject){
                        reject('ERROR THROWN');
                    });
                }
            };
            remove_site.__set__('removeCompleted', function(msg){
                if(msg === 'Could Not Remove Site (ERROR THROWN)'){
                    done();
                } else {
                    console.log('Fail - expected error message, instead received ' + msg);
                }
            });
            remove_site.__set__('ddevShell', mockShell);
            removeSite(fixtures.removeProjectDataArray);
        });

        it('should throw an error if called with invalid arguments', function(done){
            const mockShell = {
                remove: function(path,db){
                    return new Promise(function(resolve, reject){
                        resolve('ERROR THROWN');
                    });
                }
            };
            remove_site.__set__('removeCompleted', function(msg){
                if(msg === 'Invalid Input Passed To Remove'){
                    done();
                } else {
                    console.log('Fail - expected error message, instead received ' + msg);
                }
            });
            remove_site.__set__('ddevShell', mockShell);
            removeSite(fixtures.brokenProjectArrayProjectDataArray);
        });
    });
});

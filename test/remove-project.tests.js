const fixtures = require('./remove-project-fixtures');
const rewire = require('rewire');
const remove_project = rewire('../js/remove-project');

describe('remove-project', function () {
    describe('#removeProject()', function () {
        var removeProject = remove_project.__get__('removeProject');
        remove_project.__set__('displayLoadingState', function(){});
        remove_project.__set__('removeCompleted', function(){});

        beforeEach(function() {
            remove_project.__set__('removeCompleted', function(){});
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
            remove_project.__set__('ddevShell', mockShell);
            removeProject(fixtures.removeProjectArray);
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
            remove_project.__set__('ddevShell', mockShell);
            removeProject(fixtures.removeProjectDataArray);
        });

        it('should throw an error if valid called with valid arguments, but remove is unsuccessful', function(done){
            const mockShell = {
                remove: function(path,db){
                    return new Promise(function(resolve, reject){
                        reject('ERROR THROWN');
                    });
                }
            };
            remove_project.__set__('removeCompleted', function(msg){
                if(msg === 'Could Not Remove Project (ERROR THROWN)'){
                    done();
                } else {
                    console.log('Fail - expected error message, instead received ' + msg);
                }
            });
            remove_project.__set__('ddevShell', mockShell);
            removeProject(fixtures.removeProjectDataArray);
        });

        it('should throw an error if called with invalid arguments', function(done){
            const mockShell = {
                remove: function(path,db){
                    return new Promise(function(resolve, reject){
                        resolve('ERROR THROWN');
                    });
                }
            };
            remove_project.__set__('removeCompleted', function(msg){
                if(msg === fixtures.brokenErrorMessage){
                    done();
                } else {
                    console.log('Fail - expected error message, instead received ' + msg);
                }
            });
            remove_project.__set__('ddevShell', mockShell);
            removeProject(fixtures.brokenProjectArray);
        });
    });
});

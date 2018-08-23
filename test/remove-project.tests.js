const rewire = require('rewire');
const fixtures = require('./remove-project-fixtures');

const remove_project = rewire('../js/src/remove-project'); // eslint-disable-line camelcase

describe('remove-project', () => {
  describe('#removeProject()', () => {
    const removeProject = remove_project.__get__('removeProject');
    remove_project.__set__('displayLoadingState', () => {});
    remove_project.__set__('removeCompleted', () => {});

    beforeEach(() => {
      remove_project.__set__('removeCompleted', () => {});
    });

    it('should call ddevShell module and attempt to exec `ddev remove` from path with no remove flag', done => {
      const mockShell = {
        remove(name, db) {
          return new Promise((resolve, reject) => {
            if (name === 'testyMcTestProject' && db === false) {
              done();
            } else {
              console.log('Fail - Path and DB Removal flag did not get passed as expected!');
            }
            resolve();
          });
        },
      };
      remove_project.__set__('ddevShell', mockShell);
      removeProject(fixtures.removeProjectArray);
    });
    it('should call ddevShell module and attempt to exec `ddev remove` from path with the remove db flag', done => {
      const mockShell = {
        remove(name, db) {
          return new Promise((resolve, reject) => {
            if (name === 'testyMcTestProject' && db === true) {
              done();
            } else {
              console.log('Fail - Path and DB Removal flag did not get passed as expected!');
            }
            resolve();
          });
        },
      };
      remove_project.__set__('ddevShell', mockShell);
      removeProject(fixtures.removeProjectDataArray);
    });

    it('should throw an error if valid called with valid arguments, but remove is unsuccessful', done => {
      const mockShell = {
        remove(name, db) {
          return new Promise((resolve, reject) => {
            reject(new Error('ERROR THROWN'));
          });
        },
      };
      remove_project.__set__('removeCompleted', msg => {
        if (msg === 'Could Not Remove Project (ERROR THROWN)') {
          done();
        } else {
          console.log(`Fail - expected error message, instead received ${msg}`);
        }
      });
      remove_project.__set__('ddevShell', mockShell);
      removeProject(fixtures.removeProjectDataArray);
    });

    it('should throw an error if called with invalid arguments', done => {
      const mockShell = {
        remove(name, db) {
          return new Promise((resolve, reject) => {
            resolve('ERROR THROWN');
          });
        },
      };
      remove_project.__set__('removeCompleted', msg => {
        if (msg === fixtures.brokenErrorMessage) {
          done();
        } else {
          console.log(`Fail - expected error message, instead received ${msg}`);
        }
      });
      remove_project.__set__('ddevShell', mockShell);
      removeProject(fixtures.brokenProjectArray);
    });
  });
});

const { stubSpawnOnce } = require('stub-spawn-once');
const assert = require('assert');
const fixtures = require('./ddev-shell-fixtures');

const ddevShell = require('../src/renderer/modules/ddev-shell');

describe('ddev-shell', () => {
  describe('#list()', () => {
    stubSpawnOnce('ddev list -j', 0, JSON.stringify(fixtures.validListOutput));
    it('should parse `ddev list` shell output and return an array of site objects', () =>
      ddevShell.list().then(result => {
        assert.equal(JSON.stringify(fixtures.expectedSitesArray), JSON.stringify(result));
      }));
  });

  describe('#start()', () => {
    stubSpawnOnce('ddev start', 0, fixtures.validStartOutput);
    it('should call the success callback if process exits with no issue', done => {
      ddevShell.start(
        '~/',
        msg => {
          if (msg.toString() === fixtures.validStartOutput) {
            done();
            stubSpawnOnce('ddev start', 1, fixtures.invalidStartOutput);
          }
        },
        () => {}
      );
    });
    it('should call the error callback if process exits with a non 0 code', done => {
      ddevShell.start(
        '~/',
        () => {},
        err => {
          if (err === fixtures.invalidStartOutput) {
            done();
          }
        }
      );
    });
  });

  describe('#stop()', () => {
    stubSpawnOnce('ddev stop', 0, fixtures.validStopOutput);
    it('should call the success callback if process exits with no issue', done => {
      ddevShell.stop(
        '~/',
        msg => {
          if (msg.toString() === fixtures.validStopOutput) {
            done();
            stubSpawnOnce('ddev stop', 1, fixtures.invalidStopOutput);
          }
        },
        () => {}
      );
    });
    it('should call the error callback if process exits with a non 0 code', done => {
      ddevShell.stop(
        '~/',
        () => {},
        err => {
          if (err === fixtures.invalidStopOutput) {
            done();
          }
        }
      );
    });
  });

  describe('#restart()', () => {
    stubSpawnOnce('ddev restart', 0, fixtures.validRestartOutput);
    it('should call the success callback if process exits with no issue', done => {
      ddevShell.restart(
        '~/',
        msg => {
          if (msg === 'Process Exited With Code 0') {
            done();
            stubSpawnOnce('ddev restart', 1, fixtures.validStartOutput);
          }
        },
        () => {}
      );
    });
    it('should call the error callback if process exits with a non 0 code', done => {
      ddevShell.restart(
        '~/',
        () => {},
        () => {
          done();
        }
      );
    });
  });

  describe('#describe()', () => {
    stubSpawnOnce('ddev describe drupaltest -j', 0, JSON.stringify(fixtures.validDescribeJSON));
    it('should parse `ddev describe drupaltest` shell output and return an object of site information', () =>
      ddevShell.describe('drupaltest', () => {}).then(result => {
        assert.equal(JSON.stringify(fixtures.expectedDescribeObject), JSON.stringify(result));
        stubSpawnOnce('ddev describe drupaltest -j', 1, fixtures.invalidDescribeOutput);
      }));
    it('should throw an error on error of ddev describe (expecting non 0 exit code)', () =>
      ddevShell.describe('drupaltest').then(
        result => {
          throw new Error(`Promise was unexpectedly fulfilled. Result: ${result}`);
        },
        error => {
          assert(error === fixtures.invalidDescribeOutput);
        }
      ));
  });

  describe('#remove()', () => {
    stubSpawnOnce('ddev remove -j testyMcTestProject', 0, fixtures.validRemoveOutput);
    it('should resolve the promise if it exits with no issue', done => {
      ddevShell
        .remove('testyMcTestProject', false)
        .then(() => {
          stubSpawnOnce(
            'ddev remove -j --remove-data testyMcTestProject',
            0,
            fixtures.validRemoveDBOutput
          );
          done();
        })
        .catch(err => {
          throw new Error(`Promise rejected. error: ${err}`);
        });
    });
    it('should pass the --remove-data flag to ddev cli if passed in', done => {
      ddevShell
        .remove('testyMcTestProject', true)
        .then(msg => {
          if (msg === fixtures.validRemoveDBOutput) {
            stubSpawnOnce('ddev remove -j testyMcTestProject', 1, fixtures.invalidRemoveOutput);
            done();
          }
        })
        .catch(err => {
          throw new Error(`Promise rejected. error: ${err}`);
        });
    });
    it('should call the error callback if process exits with a non 0 code', done => {
      ddevShell
        .remove('testyMcTestProject', false)
        .then(result => {
          throw new Error(`Promise was unexpectedly fulfilled. Result: ${result}`);
        })
        .catch(() => {
          done();
        });
    });
  });
});

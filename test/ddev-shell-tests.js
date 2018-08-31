import { stubSpawnOnce } from 'stub-spawn-once';
import assert, { equal } from 'assert';
import {
  validListOutput,
  expectedSitesArray,
  validStartOutput,
  invalidStartOutput,
  validStopOutput,
  invalidStopOutput,
  validRestartOutput,
  validDescribeJSON,
  expectedDescribeObject,
  invalidDescribeOutput,
  validRemoveOutput,
  validRemoveDBOutput,
  invalidRemoveOutput,
} from './ddev-shell-fixtures';

import {
  list,
  start,
  stop,
  restart,
  describe as _describe,
  remove,
} from '../src/renderer/modules/ddev-shell';

describe('ddev-shell', () => {
  describe('#list()', () => {
    stubSpawnOnce('ddev list -j', 0, JSON.stringify(validListOutput));
    it('should parse `ddev list` shell output and return an array of site objects', () =>
      list().then(result => {
        equal(JSON.stringify(expectedSitesArray), JSON.stringify(result));
      }));
  });

  describe('#start()', () => {
    stubSpawnOnce('ddev start', 0, validStartOutput);
    it('should call the success callback if process exits with no issue', done => {
      start(
        '~/',
        msg => {
          if (msg.toString() === validStartOutput) {
            done();
            stubSpawnOnce('ddev start', 1, invalidStartOutput);
          }
        },
        () => {}
      );
    });
    it('should call the error callback if process exits with a non 0 code', done => {
      start(
        '~/',
        () => {},
        err => {
          if (err === invalidStartOutput) {
            done();
          }
        }
      );
    });
  });

  describe('#stop()', () => {
    stubSpawnOnce('ddev stop', 0, validStopOutput);
    it('should call the success callback if process exits with no issue', done => {
      stop(
        '~/',
        msg => {
          if (msg.toString() === validStopOutput) {
            done();
            stubSpawnOnce('ddev stop', 1, invalidStopOutput);
          }
        },
        () => {}
      );
    });
    it('should call the error callback if process exits with a non 0 code', done => {
      stop(
        '~/',
        () => {},
        err => {
          if (err === invalidStopOutput) {
            done();
          }
        }
      );
    });
  });

  describe('#restart()', () => {
    stubSpawnOnce('ddev restart', 0, validRestartOutput);
    it('should call the success callback if process exits with no issue', done => {
      restart(
        '~/',
        msg => {
          if (msg === 'Process Exited With Code 0') {
            done();
            stubSpawnOnce('ddev restart', 1, validStartOutput);
          }
        },
        () => {}
      );
    });
    it('should call the error callback if process exits with a non 0 code', done => {
      restart(
        '~/',
        () => {},
        () => {
          done();
        }
      );
    });
  });

  describe('#describe()', () => {
    stubSpawnOnce('ddev describe drupaltest -j', 0, JSON.stringify(validDescribeJSON));
    it('should parse `ddev describe drupaltest` shell output and return an object of site information', () =>
      _describe('drupaltest', () => {}).then(result => {
        equal(JSON.stringify(expectedDescribeObject), JSON.stringify(result));
        stubSpawnOnce('ddev describe drupaltest -j', 1, invalidDescribeOutput);
      }));
    it('should throw an error on error of ddev describe (expecting non 0 exit code)', () =>
      _describe('drupaltest').then(
        result => {
          throw new Error(`Promise was unexpectedly fulfilled. Result: ${result}`);
        },
        error => {
          assert(error === invalidDescribeOutput);
        }
      ));
  });

  describe('#remove()', () => {
    stubSpawnOnce('ddev remove -j testyMcTestProject', 0, validRemoveOutput);
    it('should resolve the promise if it exits with no issue', done => {
      remove('testyMcTestProject', false)
        .then(() => {
          stubSpawnOnce('ddev remove -j --remove-data testyMcTestProject', 0, validRemoveDBOutput);
          done();
        })
        .catch(err => {
          throw new Error(`Promise rejected. error: ${err}`);
        });
    });
    it('should pass the --remove-data flag to ddev cli if passed in', done => {
      remove('testyMcTestProject', true)
        .then(msg => {
          if (msg === validRemoveDBOutput) {
            stubSpawnOnce('ddev remove -j testyMcTestProject', 1, invalidRemoveOutput);
            done();
          }
        })
        .catch(err => {
          throw new Error(`Promise rejected. error: ${err}`);
        });
    });
    it('should call the error callback if process exits with a non 0 code', done => {
      remove('testyMcTestProject', false)
        .then(result => {
          throw new Error(`Promise was unexpectedly fulfilled. Result: ${result}`);
        })
        .catch(() => {
          done();
        });
    });
  });
});

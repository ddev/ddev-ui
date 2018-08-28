import nock from 'nock';
import mockFS, { restore } from 'mock-fs';
import {
  drupal7ApiResponse,
  drupal7ExpectedLatestVersion,
  drupal8ApiResponse,
  drupal8ExpectedLatestVersion,
  wordpressApiResponse,
  wordpressExpectedLatestVersion,
  mockOutdatedFilesystem,
  expectedOutdatedFilesystem,
  expectedDeletedFilesystem,
} from './distro-updater-fixtures';
import {
  getNewestDrupalVersion,
  getNewestWordpressVersion,
  getLocalDistros,
  getLocalVersion,
  canReadAndWrite,
  deleteFile,
} from '../src/renderer/modules/distro-updater';

describe('distro-updater', () => {
  describe('#Remote Read Actions', () => {
    it('should fetch most recent drupal version for v7', done => {
      const mockRequest = nock('https://updates.drupal.org')
        .get('/release-history/drupal/7.x')
        .reply(200, drupal7ApiResponse, {
          'Content-Type': 'application/xml',
        });
      getNewestDrupalVersion(7).then(version => {
        if (JSON.stringify(version) === drupal7ExpectedLatestVersion) {
          done();
        }
      });
    });
    it('should fetch most recent drupal version for v8', done => {
      const mockRequest = nock('https://updates.drupal.org')
        .get('/release-history/drupal/8.x')
        .reply(200, drupal8ApiResponse, {
          'Content-Type': 'application/xml',
        });
      getNewestDrupalVersion(8).then(version => {
        if (JSON.stringify(version) === drupal8ExpectedLatestVersion) {
          done();
        }
      });
    });
    it('should fetch most recent wordpress version', done => {
      const mockRequest = nock('https://api.github.com')
        .get('/repos/wordpress/wordpress/tags')
        .reply(200, wordpressApiResponse);
      getNewestWordpressVersion().then(version => {
        if (JSON.stringify(version) === wordpressExpectedLatestVersion) {
          done();
        }
      });
    });
  });
  describe('#Local Read Actions', () => {
    beforeEach(done => {
      mockFS(mockOutdatedFilesystem);
      done();
    });

    afterEach(done => {
      restore();
      done();
    });

    it('should fetch all files in the ~/.ddev/CMS directory', done => {
      getLocalDistros('~/.ddev/CMS').then(result => {
        if (JSON.stringify(result) === JSON.stringify(expectedOutdatedFilesystem)) {
          done();
        }
      });
    });
    it('should loop through all files and get installed version numbers for drupal 7', done => {
      getLocalVersion('drupal', '~/.ddev/CMS', 7).then(version => {
        if (version === '7.0') {
          done();
        }
      });
    });
    it('should loop through all files and get installed version numbers for drupal 8', done => {
      getLocalVersion('drupal', '~/.ddev/CMS', 8).then(version => {
        if (version === '8.0') {
          done();
        }
      });
    });
    it('should loop through all files and get installed version numbers for wordpress', done => {
      getLocalVersion('wordpress', '~/.ddev/CMS').then(version => {
        if (version === '7.0.0') {
          done();
        }
      });
    });
  });
  describe('#Filesystem Read/Write Actions', () => {
    beforeEach(done => {
      mockFS(mockOutdatedFilesystem);
      done();
    });

    afterEach(done => {
      restore();
      done();
    });
    it('should resolve a promise if a path exists and is writable', done => {
      canReadAndWrite('~/.ddev/CMS/')
        .then(() => {
          done();
        })
        .catch(err => {
          console.log(err);
        });
    });
    it('should throw an error if a path does not exist or is not writable', done => {
      canReadAndWrite('~/.ddev/CMSnotfound/')
        .then(() => {
          console.log('Unexpected resolve - canReadAndWrite should fail');
        })
        .catch(err => {
          done();
        });
    });
    it('should delete a local file by filename', done => {
      deleteFile('~/.ddev/CMS/drupal-7.0.tar.gz').then(() => {
        getLocalDistros('~/.ddev/CMS').then(result => {
          if (JSON.stringify(result) === expectedDeletedFilesystem) {
            done();
          }
        });
      });
    });
  });
});

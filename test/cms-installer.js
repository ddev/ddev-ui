const rewire = require('rewire');

const cmsInstaller = rewire('../js/src/cms-installer');
const assert = require('assert');
const mockFS = require('mock-fs');
const cmsInstallerFixtures = require('./cms-installer-fixtures');

describe('cms-installer', () => {
  describe('#Validations', () => {
    const validateHostname = cmsInstaller.__get__('validateHostname');
    const validateCMSType = cmsInstaller.__get__('validateCMSType');

    it('should validate conforming hostnames', () =>
      validateHostname(cmsInstallerFixtures.validHostname).then(result => {
        assert(result === true);
      }));
    it('should reject invalid hostnames', () =>
      validateHostname(cmsInstallerFixtures.invalidHostname)
        .then(() => Promise.reject(new Error('Expected method to reject.')))
        .catch(err => {
          assert(err === 'Project Name is Invalid.');
        }));
    it('should reject empty hostnames', () =>
      validateHostname('')
        .then(() => Promise.reject(new Error('Expected method to reject.')))
        .catch(err => {
          assert(err === 'Project Name Cannot Be Blank.');
        }));
    it('should validate supported CMS types', () =>
      validateCMSType(cmsInstallerFixtures.validCMSType).then(result => {
        assert(result === true);
      }));
    it('should reject unsupported CMS types', () =>
      validateCMSType(cmsInstallerFixtures.invalidCMSType)
        .then(() => Promise.reject(new Error('Expected method to reject.')))
        .catch(err => {
          assert(err === 'CMS Type is Invalid.');
        }));
    it('should reject empty CMS types', () =>
      validateCMSType('')
        .then(() => Promise.reject(new Error('Expected method to reject.')))
        .catch(err => {
          assert(err === 'Please select a CMS type.');
        }));

    // validateInstallPath is a wrapper for distroUpdater.canReadAndWrite, tests included in that module

    // getCMSTarballPath is a wrapper for distroUpdater.getLocalDistros, tests included in that module
  });

  describe('#Filesystem Operations', () => {
    beforeEach(done => {
      mockFS(cmsInstallerFixtures.mockFileSystem);
      done();
    });

    afterEach(done => {
      mockFS.restore();
      done();
    });

    const getCMSTarballPath = cmsInstaller.__get__('getCMSTarballPath');

    // unpackCMSTarball is a wrapper for the tarball npm library, unit tests exist there

    it('should retrieve the full path to a tarball given the distro name and the CMS path', () =>
      getCMSTarballPath('wordpress', '~/.ddev/CMS').then(tarballPath => {
        assert(tarballPath === '~/.ddev/CMS/wordpress-7.0.0.tar.gz');
      }));

    it('should fail if no such file is found', () =>
      getCMSTarballPath('drupal8', '~/.ddev/CMS')
        .then(response => Promise.reject(new Error('Expected method to reject.')))
        .catch(err => {
          assert(
            err ===
              'CMS archive not found in `~/.ddev/CMS`. Restarting the UI will attempt to redownload these files.'
          );
        }));

    mockFS.restore();
  });
});

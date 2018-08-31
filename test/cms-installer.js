import rewire from 'rewire';
import assert from 'assert';
import mockFS, { restore } from 'mock-fs';
import {
  validHostname,
  invalidHostname,
  validCMSType,
  invalidCMSType,
  mockFileSystem,
} from './cms-installer-fixtures';

const helpers = rewire('../src/renderer/modules/helpers');
const cmsInstaller = rewire('../src/renderer/components/CreateProjectWizard');

describe('cms-installer', () => {
  describe('#Validations', () => {
    const validateHostname = helpers.__get__('validateHostname');
    const validateCMSType = helpers.__get__('validateCMSType');

    it('should validate conforming hostnames', () =>
      validateHostname(validHostname).then(result => {
        assert(result === true);
      }));
    it('should reject invalid hostnames', () =>
      validateHostname(invalidHostname)
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
      validateCMSType(validCMSType).then(result => {
        assert(result === true);
      }));
    it('should reject unsupported CMS types', () =>
      validateCMSType(invalidCMSType)
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
      mockFS(mockFileSystem);
      done();
    });

    afterEach(done => {
      restore();
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

    restore();
  });
});

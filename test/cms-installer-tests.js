const rewire = require('rewire');
const cmsInstallerFixtures = require('./cms-installer-fixtures');
const cmsInstaller = rewire('../js/src/cms-installer');
const assert = require('assert');
const mockFS = require('mock-fs');

describe('cms-installer', function () {
    describe('#Validations', function () {
        const validateHostname = cmsInstaller.__get__('validateHostname');
        const validateCMSType = cmsInstaller.__get__('validateCMSType');

        it('should validate conforming hostnames', function () {
            return validateHostname(cmsInstallerFixtures.validHostname).then(function fulfilled(result) {
                assert(result === true);
            });
        });
        it('should reject invalid hostnames', function () {
            return validateHostname(cmsInstallerFixtures.invalidHostname)
                .then(function () {
                    return Promise.reject('Expected method to reject.');
                }).catch(function (err) {
                    assert(err === 'Project Name is Invalid.')
                });
        });
        it('should reject empty hostnames', function () {
            return validateHostname('')
                .then(function () {
                    return Promise.reject('Expected method to reject.');
                }).catch(function (err) {
                    assert(err === 'Project Name Cannot Be Blank.')
                });
        });
        it('should validate supported CMS types', function () {
            return validateCMSType(cmsInstallerFixtures.validCMSType).then(function fulfilled(result) {
                assert(result === true);
            });
        });
        it('should reject unsupported CMS types', function () {
            return validateCMSType(cmsInstallerFixtures.invalidCMSType)
                .then(function () {
                    return Promise.reject('Expected method to reject.');
                }).catch(function (err) {
                    assert(err === 'CMS Type is Invalid.')
                });
        });
        it('should reject empty CMS types', function () {
            return validateCMSType('')
                .then(function () {
                    return Promise.reject('Expected method to reject.');
                }).catch(function (err) {
                    assert(err === 'Please select a CMS type.')
                });
        });

        //validateInstallPath is a wrapper for distroUpdater.canReadAndWrite, tests included in that module

        //getCMSTarballPath is a wrapper for distroUpdater.getLocalDistros, tests included in that module
    });

    describe('#Filesystem Operations', function () {
        beforeEach(function(done) {
            mockFS(cmsInstallerFixtures.mockFileSystem);
            done();
        });

        afterEach(function(done) {
            mockFS.restore();
            done();
        });

        const getCMSTarballPath = cmsInstaller.__get__('getCMSTarballPath');

        //unpackCMSTarball is a wrapper for the tarball npm library, unit tests exist there

        it('should retrieve the full path to a tarball given the distro name and the CMS path', function () {
            return getCMSTarballPath('wordpress','~/.ddev/CMS').then(function(tarballPath){
                assert(tarballPath === '~/.ddev/CMS/wordpress-7.0.0.tar.gz');
            })
        });

        it('should fail if no such file is found', function () {
           return getCMSTarballPath('drupal8','~/.ddev/CMS')
               .then(function (response) {
                   return Promise.reject('Expected method to reject.');
               }).catch(function (err) {
                   assert(err === 'CMS archive not found in `~/.ddev/CMS`. Restarting the UI will attempt to redownload these files.')
               });
        });

        mockFS.restore();
    })
});
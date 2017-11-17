const fixtures = require('./distro-updater-fixtures');
const distroUpdater = require('../js/distro-updater');
const assert = require('assert');


describe('distro-updater', function () {
    describe('#Remote Read Actions', function () {
        it('should fetch most recent drupal version for v7', function () {
        });
        it('should fetch most recent drupal version for v8', function () {
        });
        it('should fetch most recent wordpress version', function () {
        });
    });
    describe('#Local Read Actions', function () {
        it('should fetch all files in the ~/.ddev/CMS directory', function () {
        });
        it('should loop through all files and get installed version numbers for drupal 7', function () {
        });
        it('should loop through all files and get installed version numbers for drupal 8', function () {
        });
        it('should loop through all files and get installed version numbers for wordpress', function () {
        });
    });
    describe('#Filesystem Read/Write Actions', function () {
        it('should download a file from remote URI and save it to a specified path', function () {
        });
        it('should delete a local file by filename', function () {
        });
    });
});
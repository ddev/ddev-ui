const fixtures = require('./distro-updater-fixtures');
const distroUpdater = require('../js/distro-updater');
const nock = require('nock');
const mockFS = require('mock-fs');


describe('distro-updater', function () {
    describe('#Remote Read Actions', function () {
        it('should fetch most recent drupal version for v7', function (done) {
            var mockRequest = nock('http://updates.drupal.org')
                .get('/release-history/drupal/7.x')
                .reply(200, fixtures.drupal7ApiResponse, {
                        'Content-Type': 'application/xml'
                    }
                );
            distroUpdater.getNewestDrupalVersion(7).then(function(version){
                if(JSON.stringify(version) === fixtures.drupal7ExpectedLatestVersion) {
                    done();
                }
            })
        });
        it('should fetch most recent drupal version for v8', function (done) {
            var mockRequest = nock('http://updates.drupal.org')
                .get('/release-history/drupal/8.x')
                .reply(200, fixtures.drupal8ApiResponse, {
                        'Content-Type': 'application/xml'
                    }
                );
            distroUpdater.getNewestDrupalVersion(8)
                .then(function(version){
                    if(JSON.stringify(version) === fixtures.drupal8ExpectedLatestVersion) {
                        done();
                    }
                });
        });
        it('should fetch most recent wordpress version', function (done) {
            var mockRequest = nock('http://api.github.com')
                .get('/repos/wordpress/wordpress/tags')
                .reply(200, fixtures.wordpressApiResponse);
            distroUpdater.getNewestWordpressVersion()
                .then(function(version){
                    if(JSON.stringify(version) === fixtures.wordpressExpectedLatestVersion) {
                        done();
                    }
                });
        });
    });
    describe('#Local Read Actions', function () {
        mockFS(fixtures.mockOutdatedFilesystem);
        it('should fetch all files in the ~/.ddev/CMS directory', function (done) {
            distroUpdater.getLocalDistros('~/.ddev/CMS').then(function(result){
                if(JSON.stringify(result) === JSON.stringify(fixtures.expectedOutdatedFilesystem)) {
                    done();
                }
            });
        });
        it('should loop through all files and get installed version numbers for drupal 7', function (done) {
            distroUpdater.getLocalVersion('drupal','~/.ddev/CMS', 7).then(function(version){
                if(version === '7.0') {
                    done();
                }
            });
        });
        it('should loop through all files and get installed version numbers for drupal 8', function (done) {
            distroUpdater.getLocalVersion('drupal','~/.ddev/CMS', 8).then(function(version){
                if(version === '8.0') {
                    done();
                }
            });
        });
        it('should loop through all files and get installed version numbers for wordpress', function (done) {
            distroUpdater.getLocalVersion('wordpress','~/.ddev/CMS').then(function(version){
                if(version === '7.0.0') {
                    done();
                }
            });
        });
    });
    describe('#Filesystem Read/Write Actions', function () {
        mockFS(fixtures.mockOutdatedFilesystem);
        it('should delete a local file by filename', function () {
            distroUpdater.deleteFile('~/.ddev/CMS/drupal-7.0.tar.gz').then(function(){
                distroUpdater.getLocalDistros('~/.ddev/CMS').then(function(result){
                    if(JSON.stringify(result) === fixtures.expectedDeletedFilesystem){
                        done();
                    }
                });
            });
        });
    });
});
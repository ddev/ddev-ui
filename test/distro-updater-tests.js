const fixtures = require('./distro-updater-fixtures');
const distroUpdater = require('../js/src/distro-updater');
const nock = require('nock');
const mockFS = require('mock-fs');


describe('distro-updater', function () {
    describe('#Remote Read Actions', function () {
        it('should fetch most recent drupal version for v7', function (done) {
            var mockRequest = nock('https://updates.drupal.org')
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
            var mockRequest = nock('https://updates.drupal.org')
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
            var mockRequest = nock('https://api.github.com')
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
        beforeEach(function(done) {
            mockFS(fixtures.mockOutdatedFilesystem);
            done();
        });

        afterEach(function(done) {
            mockFS.restore();
            done();
        });

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
        beforeEach(function(done) {
            mockFS(fixtures.mockOutdatedFilesystem);
            done();
        });

        afterEach(function(done) {
            mockFS.restore();
            done();
        });
        it('should resolve a promise if a path exists and is writable', function (done) {
            distroUpdater.canReadAndWrite('~/.ddev/CMS/')
                .then(function() {
                    done();
                })
                .catch(function(err) {
                    console.log(err);
                })
        });
        it('should throw an error if a path does not exist or is not writable', function (done) {
            distroUpdater.canReadAndWrite('~/.ddev/CMSnotfound/')
                .then(function() {
                    console.log('Unexpected resolve - canReadAndWrite should fail')
                })
                .catch(function(err) {
                    done();
                })
        });
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
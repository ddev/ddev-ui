var request = require('request');
var parseXMLString = require('xml2js').parseString;
var fs = require('fs');
var compareVersions = require('compare-versions');

// Remote read actions - fetch latest version information from remote endpoints
function getNewestDrupalVersion(majorVersion) {
    var promise = new Promise(function(resolve, reject) {
        var options = {
            url: "http://updates.drupal.org/release-history/drupal/" + majorVersion + ".x",
            headers: {
                'User-Agent': 'request'
            }
        };

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                parseXMLString(body, function(err, result){
                    var latestRelease = {
                        "version": result.project.releases["0"].release["0"].version["0"],
                        "uri": result.project.releases["0"].release["0"].download_link["0"]
                    };
                    resolve(latestRelease);
                });
            } else {
                reject(error);
            }
        }

        request(options, callback);
    });
    return promise;
}
function getNewestWordpressVersion() {
    var promise = new Promise(function(resolve, reject) {
        var options = {
            url: 'http://api.github.com/repos/wordpress/wordpress/tags',
            headers: {
                'User-Agent': 'request'
            }
        };

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                var responseJSON = JSON.parse(body);
                resolve({
                    "version": responseJSON[0].name,
                    "uri": "http://wordpress.org/latest.tar.gz"
                });
            } else {
                reject(error);
            }
        }

        request(options, callback);
    });
    return promise;
}

// Local read actions - read filesystem and local version info
function getLocalDistros(localPath){
    var promise = new Promise(function(resolve, reject) {

        function readFiles(path) {
            fs.readdir(path, function(err, filenames) {
                if(err) {
                    reject(err);
                } else {
                    resolve(filenames);
                }
            });
        }

        readFiles(localPath);
    });
    return promise;
}
function getLocalVersion(distro, path, majorVersion = null){
    var promise = new Promise(function(resolve, reject) {
        getLocalDistros(path)
            .then(function(fileList){
                fileList.forEach(function(fileName){
                    var fileNameArray = fileName.split('-');
                    if(fileNameArray.length === 2) {
                        if(fileNameArray[0] === distro) {
                            var versionNumber = fileNameArray[1].split('.tar')[0];
                            if(majorVersion) {
                                if(versionNumber.split('.')[0]*1 === majorVersion){
                                    resolve(versionNumber);
                                }
                            }else{
                                resolve(versionNumber);
                            }
                        }
                    }
                });
                resolve('0.0');
            })
            .catch(function(error){
                reject(error);
            });
    });

    return promise;
}

// Filesystem read/write actions - delete outdated repo and download/save new files
function downloadFile(url, path) {
    var promise = new Promise(function(resolve, reject) {
        request({uri: url})
            .pipe(fs.createWriteStream(path))
            .on('close', function () {
                resolve('written successfully');
            })
            .on('error', function (err) {
                reject(err);
            });
    });

    return promise;
}
function deleteFile(filePath) {
    var promise = new Promise(function(resolve, reject) {
        fs.unlink(filePath, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });

    return promise;
}

// public function, handles checking remote, comparing local, and downloading new/deleting old files.
const updateDistros = function() {
    var promise = new Promise(function(resolve, reject) {
        var cmsPath = "~/.ddev/CMS";
        cmsPath = cmsPath.replace('~', os.homedir());

        var drupal7Promise = getLocalVersion('drupal', cmsPath, 7);
        var drupal8Promise = getLocalVersion('drupal', cmsPath, 8);
        var wordpressPromise = getLocalVersion('wordpress', cmsPath);

        Promise.all([drupal7Promise, drupal8Promise, wordpressPromise]).then(function(localVersions) {
            var drupal7Promise = getNewestDrupalVersion(7);
            var drupal8Promise = getNewestDrupalVersion(8);
            var wordpressPromise = getNewestWordpressVersion();

            Promise.all([drupal7Promise, drupal8Promise, wordpressPromise]).then(function(newestVersions) {
                if(compareVersions(localVersions[0], newestVersions[0].version) < 0){
                    var currentVersion = localVersions[0];
                    var newVersion = newestVersions[0];
                    downloadFile(newVersion.uri, cmsPath + '/drupal-' + newVersion.version + '.tar.gz');
                    if(currentVersion !== '0.0') {
                        deleteFile(cmsPath + "/drupal-" + currentVersion + '.tar.gz');
                    }
                }
                if(compareVersions(localVersions[1], newestVersions[1].version) < 0){
                    var currentVersion = localVersions[1];
                    var newVersion = newestVersions[1];
                    downloadFile(newVersion.uri, cmsPath + '/drupal-' + newVersion.version + '.tar.gz');
                    if(currentVersion !== '0.0') {
                        deleteFile(cmsPath + "/drupal-" + currentVersion + '.tar.gz');
                    }
                }
                if(compareVersions(localVersions[2], newestVersions[2].version) < 0){
                    var currentVersion = localVersions[2];
                    var newVersion = newestVersions[2];
                    downloadFile(newVersion.uri, cmsPath + '/wordpress-' + newVersion.version + '.tar.gz');
                    if(currentVersion !== '0.0') {
                        deleteFile(cmsPath + "/wordpress-" + currentVersion +'.tar.gz');
                    }
                }
                resolve();
            });
        });
    });

    return promise;
};

module.exports.updateDistros = updateDistros;

module.exports.getNewestDrupalVersion = getNewestDrupalVersion;
module.exports.getNewestWordpressVersion = getNewestWordpressVersion;
module.exports.getLocalDistros = getLocalDistros;
module.exports.getLocalVersion = getLocalVersion;
module.exports.downloadFile = downloadFile;
module.exports.deleteFile = deleteFile;

var request = require('request');
var parseXMLString = require('xml2js').parseString;
var fs = require('fs');
var compareVersions = require('compare-versions');

// Remote read actions - fetch latest version information from remote endpoints

/**
 * Get newest version of drupal by major version and the URI that the tarball can be found
 * @param majorVersion {number} major version number i.e. 7 or 8
 * @return {promise} an object containing the latest version and URI at which the tarball can be downloaded
 */
function getNewestDrupalVersion(majorVersion) {
    var promise = new Promise(function(resolve, reject) {
        var options = {
            url: "https://updates.drupal.org/release-history/drupal/" + majorVersion + ".x",
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

/**
 * Get newest version of wordpress and the URI that the tarball can be found
 * @return {promise/object} an object containing the latest version and URI at which the tarball can be downloaded
 */
function getNewestWordpressVersion() {
    var promise = new Promise(function(resolve, reject) {
        var options = {
            url: 'https://api.github.com/repos/wordpress/wordpress/tags',
            headers: {
                'User-Agent': 'request'
            }
        };

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                var responseJSON = JSON.parse(body);
                resolve({
                    "version": responseJSON[0].name,
                    "uri": "https://wordpress.org/wordpress-"+responseJSON[0].name+".tar.gz"
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
/**
 * Get a list of files in a given directory
 * @param localPath {string} path on local filesystem to retrieve file listing of
 * @return {promise/array} an array containing strings of filenames in the target directory
 */
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

/**
 * Get the local version of a target CMS Distro within a target path
 * @param distro {string} name of CMS to be version checked i.e. wordpress or drupal
 * @param path {string} path to check for CMS files
 * @param majorVersion {number} optional - the major version number to check for drupal
 * @return {promise} an object containing the version number for local CMS distro tarballs, or 0.0 if not found.
 */
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
/**
 * Check if a target directory exists and can be written to
 * @param targetPath {string} path to determine existence and write permissions
 * @return {promise/boolean} returns true if path both exists and is writable
 */
function canReadAndWrite(targetPath) {
    return new Promise(function (resolve, reject) {
        fs.stat(targetPath, function (err) {
            if (err) { reject(err); return; }
            fs.access(targetPath, fs.W_OK | fs.R_OK, (err) => {
                if (err) {
                    const dir = path.dirname(targetPath);
                    fs.access(dir, fs.W_OK | fs.R_OK, (err) => {
                        if (err) { reject(err); return; }
                        resolve(false);
                    });
                }
                resolve(true);
            })
        })
    });
}

/**
 * downloads a file from target URL and saves it to a target path
 * @param url {string} URL to file to be downloaded
 * @param path {string} path to save downloaded file
 * @return {promise} resolves if file is successfully downloaded and written
 */
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

/**
 * Deletes file from local filesystem
 * @param filePath {string} path of file to delete
 * @return {promise} resolves if file deletion is successful
 */
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
/**
 * Gets versions of locally existing CMSes, compares them to latest versions. If newer found on remote or
 * if not found locally, newest version is downloaded to CMS path. Outdated local versions are deleted upon
 * successful updated file download.
 * @return {promise} resolves upon successful update or no change needed.
 */
const updateDistros = function() {
    var promise = new Promise(function(resolve, reject) {
        var cmsPath = "~/.ddev/CMS";
        cmsPath = cmsPath.replace('~', os.homedir());

        if (!fs.existsSync(cmsPath)){
            fs.mkdirSync(cmsPath);
        }

        canReadAndWrite(cmsPath).then(function(directoryContents){
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
        })
        .catch(function(error){
            reject(error);
        });
    });

    return promise;
};

module.exports.updateDistros = updateDistros;

module.exports.getNewestDrupalVersion = getNewestDrupalVersion;
module.exports.getNewestWordpressVersion = getNewestWordpressVersion;
module.exports.getLocalDistros = getLocalDistros;
module.exports.getLocalVersion = getLocalVersion;
module.exports.canReadAndWrite = canReadAndWrite;
module.exports.downloadFile = downloadFile;
module.exports.deleteFile = deleteFile;

import request from 'request';
import { parseString as parseXMLString } from 'xml2js';
import {
  readdir,
  stat,
  access,
  W_OK,
  R_OK,
  createWriteStream,
  unlink,
  existsSync,
  mkdirSync,
} from 'fs';
import compareVersions from 'compare-versions';
import { homedir } from 'os';
import { dirname } from 'path';

// Remote read actions - fetch latest version information from remote endpoints

/**
 * Get newest version of drupal by major version and the URI that the tarball can be found
 * @param majorVersion {number} major version number i.e. 7 or 8
 * @return {promise} an object containing the latest version and URI at which the tarball can be downloaded
 */
function getNewestDrupalVersion(majorVersion) {
  const promise = new Promise((resolve, reject) => {
    const options = {
      url: `https://updates.drupal.org/release-history/drupal/${majorVersion}.x`,
      headers: {
        'User-Agent': 'request',
      },
    };

    function callback(error, response, body) {
      if (!error && response.statusCode === 200) {
        parseXMLString(body, (err, result) => {
          const latestRelease = {
            version: result.project.releases['0'].release['0'].version['0'],
            uri: result.project.releases['0'].release['0'].download_link['0'],
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
  const promise = new Promise((resolve, reject) => {
    const options = {
      url: 'https://api.github.com/repos/wordpress/wordpress/tags',
      headers: {
        'User-Agent': 'request',
      },
    };

    function callback(error, response, body) {
      if (!error && response.statusCode === 200) {
        const responseJSON = JSON.parse(body);
        resolve({
          version: responseJSON[0].name,
          uri: `https://wordpress.org/wordpress-${responseJSON[0].name}.tar.gz`,
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
function getLocalDistros(localPath) {
  const promise = new Promise((resolve, reject) => {
    function readFiles(filePath) {
      readdir(filePath, (err, filenames) => {
        if (err) {
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
function getLocalVersion(distro, localPath, majorVersion = null) {
  const promise = new Promise((resolve, reject) => {
    getLocalDistros(localPath)
      .then(fileList => {
        fileList.forEach(fileName => {
          const fileNameArray = fileName.split('-');
          if (fileNameArray.length === 2) {
            if (fileNameArray[0] === distro) {
              const versionNumber = fileNameArray[1].split('.tar')[0];
              if (majorVersion) {
                if (versionNumber.split('.')[0] * 1 === majorVersion) {
                  resolve(versionNumber);
                }
              } else {
                resolve(versionNumber);
              }
            }
          }
        });
        resolve('0.0');
      })
      .catch(error => {
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
  return new Promise((resolve, reject) => {
    stat(targetPath, err => {
      if (err) {
        reject(err);
        return;
      }
      /* eslint-disable no-bitwise */
      access(targetPath, W_OK | R_OK, err => {
        if (err) {
          const dir = dirname(targetPath);
          access(dir, W_OK | R_OK, err => {
            if (err) {
              reject(err);
              return;
            }
            resolve(false);
          });
        }
        resolve(true);
      });
      /* eslint-enable no-bitwise */
    });
  });
}

/**
 * downloads a file from target URL and saves it to a target path
 * @param url {string} URL to file to be downloaded
 * @param filePath {string} filePath to save downloaded file
 * @return {promise} resolves if file is successfully downloaded and written
 */
function downloadFile(url, filePath) {
  const promise = new Promise((resolve, reject) => {
    request({ uri: url })
      .pipe(createWriteStream(filePath))
      .on('close', () => {
        resolve('written successfully');
      })
      .on('error', err => {
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
  const promise = new Promise((resolve, reject) => {
    unlink(filePath, err => {
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
  const promise = new Promise((resolve, reject) => {
    let cmsPath = '~/.ddev/CMS';
    cmsPath = cmsPath.replace('~', homedir());

    if (!existsSync(cmsPath)) {
      mkdirSync(cmsPath);
    }

    canReadAndWrite(cmsPath)
      .then(() => {
        const drupal7LocalPromise = getLocalVersion('drupal', cmsPath, 7);
        const drupal8LocalPromise = getLocalVersion('drupal', cmsPath, 8);
        const wordpressLocalPromise = getLocalVersion('wordpress', cmsPath);

        Promise.all([drupal7LocalPromise, drupal8LocalPromise, wordpressLocalPromise]).then(
          localVersions => {
            const drupal7NewPromise = getNewestDrupalVersion(7);
            const drupal8NewPromise = getNewestDrupalVersion(8);
            const wordpressNewPromise = getNewestWordpressVersion();

            Promise.all([drupal7NewPromise, drupal8NewPromise, wordpressNewPromise]).then(
              newestVersions => {
                if (compareVersions(localVersions[0], newestVersions[0].version) < 0) {
                  const currentVersion = localVersions[0];
                  const newVersion = newestVersions[0];
                  downloadFile(newVersion.uri, `${cmsPath}/drupal-${newVersion.version}.tar.gz`);
                  if (currentVersion !== '0.0') {
                    deleteFile(`${cmsPath}/drupal-${currentVersion}.tar.gz`);
                  }
                }
                if (compareVersions(localVersions[1], newestVersions[1].version) < 0) {
                  const currentVersion = localVersions[1];
                  const newVersion = newestVersions[1];
                  downloadFile(newVersion.uri, `${cmsPath}/drupal-${newVersion.version}.tar.gz`);
                  if (currentVersion !== '0.0') {
                    deleteFile(`${cmsPath}/drupal-${currentVersion}.tar.gz`);
                  }
                }
                if (compareVersions(localVersions[2], newestVersions[2].version) < 0) {
                  const currentVersion = localVersions[2];
                  const newVersion = newestVersions[2];
                  downloadFile(newVersion.uri, `${cmsPath}/wordpress-${newVersion.version}.tar.gz`);
                  if (currentVersion !== '0.0') {
                    deleteFile(`${cmsPath}/wordpress-${currentVersion}.tar.gz`);
                  }
                }
                resolve();
              }
            );
          }
        );
      })
      .catch(error => {
        reject(error);
      });
  });

  return promise;
};

const _updateDistros = updateDistros;
export { _updateDistros as updateDistros };

const _getNewestDrupalVersion = getNewestDrupalVersion;
export { _getNewestDrupalVersion as getNewestDrupalVersion };
const _getNewestWordpressVersion = getNewestWordpressVersion;
export { _getNewestWordpressVersion as getNewestWordpressVersion };
const _getLocalDistros = getLocalDistros;
export { _getLocalDistros as getLocalDistros };
const _getLocalVersion = getLocalVersion;
export { _getLocalVersion as getLocalVersion };
const _canReadAndWrite = canReadAndWrite;
export { _canReadAndWrite as canReadAndWrite };
const _downloadFile = downloadFile;
export { _downloadFile as downloadFile };
const _deleteFile = deleteFile;
export { _deleteFile as deleteFile };

import { x } from 'tar';
import { readdir, mkdir } from 'fs';
import { homedir } from 'os';

import { hostname as _hostname } from './ddev-shell';
import { getLocalDistros } from './distro-updater';

import {
  showLoadingScreen,
  showErrorScreen,
  validateHostname,
  validateCMSType,
  validateInstallPath,
  validateDocroot,
  configureSite,
  startSite,
  checkIfExistingConfig
} from './helpers';

/**
 * wrapper that runs all validations for new projects from CMS
 * @param name {string} hostname to be validated
 * @param type {string} cms type to be validated
 * @param targetPath {string} target install path to have read/write permissions validated
 * @return {promise} resolves if ALL validations pass, rejects with message of failed validations of any do not pass
 */
export function validateNewProjectInputs(name, type, targetPath) {
  return Promise.all([
    validateHostname(name),
    validateCMSType(type),
    validateInstallPath(targetPath),
  ]);
}

/**
 * wrapper that runs all validations for new projects from existing files
 * @param name {string} hostname to be validated
 * @param path {string} target install path to have read/write permissions validated
 * @param docroot {string} - optional - docroot path
 * @return {promise} resolves if ALL validations pass, rejects with message of failed validations of any do not pass
 */
export function validateExistingFilesInputs(name, path, docroot) {
  return Promise.all([
    validateHostname(name),
    validateInstallPath(path),
    validateDocroot(path, docroot),
  ]);
}

/**
 * Gets the file location of the CMS image tarball pre-downloaded by the UI
 * @param cmsType {string} the name of the target CMS
 * @param cmsPath {string} the path that the CMS tarballs are saved
 * @return {promise} resolves with tarball path if found, rejects with system error if not found
 */
export function getCMSTarballPath(cmsType, cmsPath) {
  const promise = new Promise((resolve, reject) => {
    let targetCMS;
    switch (cmsType) {
      case 'wordpress':
        targetCMS = 'wordpress';
        break;
      case 'drupal7':
        targetCMS = 'drupal-7';
        break;
      case 'drupal8':
        targetCMS = 'drupal-8';
        break;
      default:
        Error('No CMS selected');
    }
    getLocalDistros(cmsPath).then(files => {
      files.forEach(fileName => {
        if (fileName.indexOf(targetCMS) !== -1) {
          resolve(`${cmsPath}/${fileName}`);
        }
      });
      reject(
        new Error(
          'CMS archive not found in `~/.ddev/CMS`. Restarting the UI will attempt to redownload these files.'
        )
      );
    });
  });
  return promise;
}

/**
 * unpacks tarball to target directory
 * @param tarballPath {string} the path to a tarball to extract
 * @param outputPath {string} the path to extract the target tarball to
 * @return {promise} resolves with the path to the files extracted from tarball, rejects with system error if not
 */
export function unpackCMSTarball(tarballPath, outputPath) {
  const promise = new Promise((resolve, reject) => {
    readdir(outputPath, (err, items) => {
      if (err && err.toString().includes('ENOENT')) {
        mkdir(outputPath, err => {
          if (err) {
            reject(err);
          }
        });
      } else if (items.length > 0) {
        reject(
          new Error(
            `The path ${outputPath} already exists and is not empty. Please select a new path or try a different project name`
          )
        );
      }
    });
    try {
      x(
        {
          file: tarballPath,
          C: outputPath,
          strip: 1,
        },
        '',
        () => {
          resolve(outputPath);
        }
      );
    } catch (err) {
      reject(
        new Error(
          'Cannot extract base CMS file in `~/.ddev/CMS`. Restarting the UI will attempt to redownload them.'
        )
      );
    }
  });
  return promise;
}

/**
 * wrapper that will unpack target CMS tarball to directory based on sitename and return docroot for ddev config use
 * @param siteName {string} site name of new site. used to build directory ( ex: {targetpath}/{sitename}/wordpress)
 * @param cmsType {string} target CMS to extract
 * @param targetFolder {string} target folder to extract to
 * @return {promise} resolves with path to new site docroot, rejects with error returned from any failed called function
 */
export function extractCMSImageToTargetPath(siteName, cmsType, cmsPath, targetFolder) {
  const promise = new Promise((resolve, reject) => {
    getCMSTarballPath(cmsType, cmsPath)
      .then(CMSTarballPath => {
        const targetPath = `${targetFolder}/${siteName}`;
        unpackCMSTarball(CMSTarballPath, targetPath)
          .then(unzippedPath => {
            resolve(unzippedPath);
          })
          .catch(err => {
            reject(err);
          });
      })
      .catch(err => {
        reject(err);
      });
  });
  return promise;
}

/**
 * public function - calls private functions to validate inputs, unpack files, and configure/start site
 * @param name {string} name of site to create
 * @param type {string} type of CMS to install (drupal7, drupal8, wordpress)
 * @param targetPath {string} path to unpack CMS and install site
 */
export function addCMS(name, type, targetPath, history = {}) {
  let cmsPath = '~/.ddev/CMS';
  let workingPath = cmsPath;
  cmsPath = cmsPath.replace('~', homedir());
  showLoadingScreen(true);
  validateNewProjectInputs(name, type, targetPath)
    .then(() => {
      showLoadingScreen(true, 'Unzipping files');
      return extractCMSImageToTargetPath(name, type, cmsPath, targetPath);
    })
    .then(newWorkingPath => {
      showLoadingScreen(true, 'Configuring Project');
      workingPath = newWorkingPath;
      return configureSite(name, workingPath, '');
    })
    .then(() => {
      showLoadingScreen(true, 'Updating Hosts File');
      return _hostname(name);
    })
    .then(() => {
      showLoadingScreen(true, 'Starting Project');
      return startSite(workingPath);
    })
    .then(stdout => {
      if (stdout.toString().indexOf('Starting environment') !== -1) {
        alert(
          'Start Process Initiated. It may take a few seconds for the new project to appear on your dashboard.'
        );
        history.push(`/project/${name}`);
      }
    })
    .catch(err => {
      showErrorScreen(true, err.toString());
    });
}

/**
 * public function - calls private functions to validate inputs, runs ddev config from existing project directory
 * @param name {string} name of site to create
 * @param targetPath {string} path to existing project files
 * @param docroot {string} - optional - application docroot relative to targetPath
 */
export function addCMSFromExisting(name, targetPath, docroot = '', history = {}) {
  showLoadingScreen(true);
  validateExistingFilesInputs(name, targetPath, docroot)
    .then(() => checkIfExistingConfig(targetPath))
    .then(() => {
      showLoadingScreen(true, 'Configuring Project');
      return configureSite(name, targetPath, docroot);
    })
    .then(() => {
      showLoadingScreen(true, 'Updating Hosts File');
      return _hostname(name);
    })
    .then(() => {
      showLoadingScreen(true, 'Starting Project');
      return startSite(targetPath);
    })
    .then(stdout => {
      if (stdout.toString().indexOf('Starting environment') !== -1) {
        alert(
          'Start Process Initiated. It may take a few seconds for the new project to appear on your dashboard.'
        );
        history.push(`/project/${name}`);
      }
    })
    .catch(err => {
      showErrorScreen(true, err.toString());
    });
}

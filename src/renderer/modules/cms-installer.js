import { x } from 'tar';
import { readdir, mkdir } from 'fs';
import { homedir } from 'os';
import electron, { remote as _remote } from 'electron';
import { config, start, hostname as _hostname } from './ddev-shell';
import { canReadAndWrite, getLocalDistros } from './distro-updater';

const remote = _remote || electron;
const { dialog } = remote;

/**
 *
 * Markup Templates and DOM Bindings
 *
 */

/**
 * Display or hide a loading screen over the modal
 * @param display {boolean} - if the screen is to be displayed or hidden
 * @param message {string} - optional - the text to display on the loading screen
 */
function showLoadingScreen(display, message = 'Working...') {
  const displayType = display ? 'flex' : 'none';
  $('.loading-text').text(message.toString());
  $('.loading-overlay').css('display', displayType);
}

/**
 * Display or hide an error screen over the modal. When displayed, loading screens are dismissed
 * @param display {boolean} - if the screen is to be displayed or hidden
 * @param error {string} - optional - the text to display on the loading screen
 */
function showErrorScreen(display, error = 'Something Went Wrong') {
  $('.error-overlay').click(() => {
    showErrorScreen(false, '');
  });
  const displayType = display ? 'block' : 'none';
  showLoadingScreen(false);
  $('.error-text').text(error.toString());
  $('.error-overlay').css('display', displayType);
}

/**
 * resets the add site modal to an empty/default state.
 */
function resetAddModal() {
  $('#appType')
    .val('')
    .trigger('change');
  $('#site-name').val('');
  $('.selected-path-text').val('');
  $('#existing-project-name').val('');
  $('#existing-project-path').val('');
  $('#existing-project-docroot').val('');
  showLoadingScreen(false);
  showErrorScreen(false);
  $('#existingFilesModal').modal('hide');
  $('#distroModal').modal('hide');
}

/**
 * Basic validation of a hostname based on RFC 2396 Section 3.2.2
 * @param hostname {string} a hostname to validate
 * @return {bool} if hostname has passed validation
 */
function validateHostname(hostname) {
  const promise = new Promise((resolve, reject) => {
    const hostnameRegex = /^([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*)+(\.([a-zA-Z0-9]+(-[a-zA-Z0-9‌​]+)*))*$/; // eslint-disable-line no-irregular-whitespace
    if (hostnameRegex.test(hostname.toLowerCase())) {
      resolve(true);
    } else {
      const error = hostname ? 'Project Name is Invalid.' : 'Project Name Cannot Be Blank.';
      reject(error);
    }
  });
  return promise;
}

/**
 * Validates a supported cmsType was passed in by the UI selector
 * @param cmsType {string} the cmsType provided by the UI selector
 * @return {promise} resolves with validity boolean if passes check, rejects with error message if fails.
 */
function validateCMSType(cmsType) {
  const promise = new Promise((resolve, reject) => {
    const cmsString = cmsType.toLowerCase();
    if (cmsString === 'wordpress' || cmsString === 'drupal7' || cmsString === 'drupal8') {
      resolve(true);
    } else {
      const error = cmsType ? 'CMS Type is Invalid.' : 'Please select a CMS type.';
      reject(error);
    }
  });
  return promise;
}

/**
 * Checks if site has an existing configuration
 */
function checkIfExistingConfig(path) {
  const promise = new Promise((resolve, reject) => {
    try {
      config(path, 'validName', 'totally invalid docroot that does not exist', null, messages => {
        if (messages.includes('existing configuration')) {
          const proceed = window.confirm(
            `An existing DDEV configuration was found in ${path}. By proceeding, the existing configuration will be updated and replaced.`
          );
          if (proceed) {
            resolve(true);
          } else {
            reject(new Error('User Canceled'));
          }
        } else {
          resolve(false);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
  return promise;
}

/**
 * Validates that the chosen install path is both valid and can be written to by the UI process
 * @param path {string} path to test for read/write access
 * @return {promise} resolves if path is read/writable, rejects with system error if not
 */
function validateInstallPath(path) {
  const promise = new Promise((resolve, reject) => {
    canReadAndWrite(path)
      .then(output => {
        resolve(output);
      })
      .catch(err => {
        let errStr = err;
        errStr = errStr.toString().includes('ENOENT')
          ? 'Cannot find or write to the selected directory.'
          : errStr;
        reject(errStr);
      });
  });
  return promise;
}

/**
 * Validates that the docroot specified for a particular project folder exists and is read/writeable
 * @param path {string} - project folder path
 * @param docroot {string} - relative docroot path
 * @return {promise} resolves if full docroot path is read/writable, rejects with system error if not
 */
function validateDocroot(path, docroot) {
  let root = docroot;
  if (root[0] !== '/') {
    root = `/${root}`;
  }
  const promise = new Promise((resolve, reject) => {
    canReadAndWrite(path + root)
      .then(output => {
        resolve(output);
      })
      .catch(err => {
        let errStr = err;
        errStr = errStr.toString().includes('ENOENT')
          ? 'Cannot find or write to specified docroot directory.'
          : errStr;
        reject(errStr);
      });
  });
  return promise;
}

/**
 * Gets the file location of the CMS image tarball pre-downloaded by the UI
 * @param cmsType {string} the name of the target CMS
 * @param cmsPath {string} the path that the CMS tarballs are saved
 * @return {promise} resolves with tarball path if found, rejects with system error if not found
 */
function getCMSTarballPath(cmsType, cmsPath) {
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
function unpackCMSTarball(tarballPath, outputPath) {
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
 * wrapper that runs all validations for new projects from CMS
 * @param name {string} hostname to be validated
 * @param type {string} cms type to be validated
 * @param targetPath {string} target install path to have read/write permissions validated
 * @return {promise} resolves if ALL validations pass, rejects with message of failed validations of any do not pass
 */
function validateNewProjectInputs(name, type, targetPath) {
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
function validateExistingFilesInputs(name, path, docroot) {
  return Promise.all([
    validateHostname(name),
    validateInstallPath(path),
    validateDocroot(path, docroot),
  ]);
}

/**
 * wrapper that will unpack target CMS tarball to directory based on sitename and return docroot for ddev config use
 * @param siteName {string} site name of new site. used to build directory ( ex: {targetpath}/{sitename}/wordpress)
 * @param cmsType {string} target CMS to extract
 * @param targetFolder {string} target folder to extract to
 * @return {promise} resolves with path to new site docroot, rejects with error returned from any failed called function
 */
function extractCMSImageToTargetPath(siteName, cmsType, cmsPath, targetFolder) {
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
 * wrapper for ddev config
 * @param siteName {string} name of site to configure
 * @param workingPath {string} the path of the extracted files to run ddev config in
 * @param docroot {string} path to the working directory of project
 * @return {promise} resolves with a successful terminal output from ddev config, rejects with ddev error output
 */
function configureSite(siteName, workingPath, docroot) {
  const promise = new Promise((resolve, reject) => {
    config(workingPath, siteName, docroot, resolve, reject);
  });
  return promise;
}

/**
 * wrapper for ddev start
 * @param workingPath {string} the path of the extracted files to run ddev start in
 * @return {promise} resolves with a successful terminal output from ddev start, rejects with ddev error output
 */
function startSite(workingPath) {
  const promise = new Promise((resolve, reject) => {
    start(workingPath, resolve, reject);
  });
  return promise;
}

/**
 * prepopulates project name based on name of folder containing project files.
 * NOTE: fails silently if invalid hostname (i.e. has spaces or illegal chars)
 * @param {string} projectPath
 */
function prepopulateProjectName(projectPath) {
  const folderName = projectPath.split('/').pop();
  if (
    validateHostname(folderName)
      .then(() => {
        $('#existing-project-name').val(folderName);
      })
      .catch(err => {
        // silently fail, to be consistent with CLI, we simply do not prepoulate if invalid hostname
        console.log(err);
      })
  );
}

/**
 * public function - calls private functions to validate inputs, unpack files, and configure/start site
 * @param name {string} name of site to create
 * @param type {string} type of CMS to install (drupal7, drupal8, wordpress)
 * @param targetPath {string} path to unpack CMS and install site
 */
function addCMS(name, type, targetPath) {
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
        resetAddModal();
        alert(
          'Start Process Initiated. It may take a few seconds for the new project to appear on your dashboard.'
        );
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
function addCMSFromExisting(name, targetPath, docroot = '') {
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
        resetAddModal();
        alert(
          'Start Process Initiated. It may take a few seconds for the new project to appear on your dashboard.'
        );
      }
    })
    .catch(err => {
      showErrorScreen(true, err.toString());
    });
}

/**
 * Initialization - hook UI and generate markup.
 */
function init() {
  $(document).on('click', '.start-from-template', () => {
    resetAddModal();
    $('#addOptionsDialog').modal('hide');
    $('#distroModal').modal();
  });

  $(document).on('click', '.start-from-files', () => {
    resetAddModal();
    $('#addOptionsDialog').modal('hide');
    $('#existingFilesModal').modal();
  });

  $(document).on('click', '.select-path-folder', () => {
    const path = dialog.showOpenDialog({
      properties: ['openDirectory'],
    });
    if (path) {
      $('.selected-path-text').val(path[0]);
      $('.selected-docroot-text').val(path[0]);
      prepopulateProjectName(path[0]);
    }
  });

  $(document).on('click', '.select-docroot-folder', () => {
    const projectRoot = $('.selected-path-text').val();
    const path = dialog.showOpenDialog({
      defaultPath: projectRoot,
      properties: ['openDirectory'],
    });
    if (path) {
      if (path[0].includes(projectRoot)) {
        $('.selected-docroot-text').val(path[0]);
      } else {
        document.activeElement.blur();
        showErrorScreen(true, 'Docroot must be in the selected project folder.');
      }
    }
  });

  $(document).on('click', '.tile img', function() {
    $('#appType')
      .val($(this).data('type'))
      .trigger('change');
  });
  $(document).on('change', '#appType', function() {
    $('.tile img').removeClass('active');
    if ($(this).val()) {
      $(`.${$(this).val()}`).addClass('active');
    }
  });

  $(document).on('click', '.create-site', () => {
    const type = $('#appType').val();
    const targetPath = $('.selected-path-text').val();
    const name = $('#site-name').val();
    addCMS(name, type, targetPath);
    return false;
  });

  $(document).on('click', '.create-site-from-existing', () => {
    const name = $('#existing-project-name').val();
    const path = $('#existing-project-path').val();
    let docroot = $('#existing-project-docroot').val();
    docroot = docroot.replace(path, '');
    if (docroot[0] === '/') {
      docroot = docroot.substr(1);
    }
    addCMSFromExisting(name, path, docroot);
  });
}

const _init = init;
export { _init as init, addCMSFromExisting, addCMS };

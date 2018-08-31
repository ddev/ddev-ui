import { canReadAndWrite } from './distro-updater';
import { config, start, hostname as _hostname } from './ddev-shell';

/**
 * Checks if site has an existing configuration
 */
export function checkIfExistingConfig(path) {
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
 * wrapper for ddev config
 * @param siteName {string} name of site to configure
 * @param workingPath {string} the path of the extracted files to run ddev config in
 * @param docroot {string} path to the working directory of project
 * @return {promise} resolves with a successful terminal output from ddev config, rejects with ddev error output
 */
export function configureSite(siteName, workingPath, docroot) {
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
export function startSite(workingPath) {
  const promise = new Promise((resolve, reject) => {
    start(workingPath, resolve, reject);
  });
  return promise;
}

// parse stdout/stderr to determine error "type"
export function getErrorResponseType(error) {
  // console.log(error.msg);
  if (error.msg === 'Could not connect to docker. Please ensure Docker is installed and running.') {
    return 'docker';
  }
  return 'general';
}

/**
 * Display or hide a loading screen over the modal
 * @param display {boolean} - if the screen is to be displayed or hidden
 * @param message {string} - optional - the text to display on the loading screen
 */
export function showLoadingScreen(display, message = 'Working...') {
  const displayType = display ? 'flex' : 'none';
  $('.loading-text').text(message.toString());
  $('.loading-overlay').css('display', displayType);
}

/**
 * Display or hide an error screen over the modal. When displayed, loading screens are dismissed
 * @param display {boolean} - if the screen is to be displayed or hidden
 * @param error {string} - optional - the text to display on the loading screen
 */
export function showErrorScreen(display, error = 'Something Went Wrong') {
  $('.error-overlay').click(() => {
    showErrorScreen(false, '');
  });
  const displayType = display ? 'block' : 'none';
  showLoadingScreen(false);
  $('.error-text').text(error.toString());
  $('.error-overlay').css('display', displayType);
}

/**
 * Basic validation of a hostname based on RFC 2396 Section 3.2.2
 * @param hostname {string} a hostname to validate
 * @return {bool} if hostname has passed validation
 */
export function validateHostname(hostname) {
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
export function validateCMSType(cmsType) {
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
 * Validates that the chosen install path is both valid and can be written to by the UI process
 * @param path {string} path to test for read/write access
 * @return {promise} resolves if path is read/writable, rejects with system error if not
 */
export function validateInstallPath(path) {
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
export function validateDocroot(path, docroot) {
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

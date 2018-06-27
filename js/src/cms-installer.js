var distroUpdater = require('./distro-updater');
var bootstrapModal = require('./bootstrap-modal');
var tar = require('tar');
var fs = require('fs');
var ddevShell = require('./ddev-shell');
var os = require('os');
var electron = require('electron');
var remote = electron.remote ? electron.remote : electron;
var dialog = remote.dialog;

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
  var displayType = display ? "flex" : "none";
  $('.loading-text').text(message.toString());
  $('.loading-overlay').css('display', displayType);
}

/**
 * Display or hide an error screen over the modal. When displayed, loading screens are dismissed
 * @param display {boolean} - if the screen is to be displayed or hidden
 * @param error {string} - optional - the text to display on the loading screen
 */
function showErrorScreen(display, error = 'Something Went Wrong') {
  $('.error-overlay').click(function() {
    showErrorScreen(false, '');
  });
  var displayType = display ? "block" : "none";
  showLoadingScreen(false);
  $('.error-text').text(error.toString());
  $('.error-overlay').css('display', displayType);
}

/**
 * resets the add site modal to an empty/default state.
 */
function resetAddModal() {
  $('#appType').val('').trigger('change');
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
var addSiteOptionsModalBody =
  `<div class="row">
        <div class="option-container column col-lg-6 col-md-6 col-sm-6 start-from-files">
            <div class="btn btn-primary start-button-option-container">
                <i class="fa fa-file-archive-o" style="font-size: 50px"></i>
            </div>
            <div>Start from existing project files</div>
        </div>
        <div class="option-container second-option column col-lg-6 col-md-6 col-sm-6 start-from-template">
            <div class="btn btn-primary start-button-option-container">
                <i class="fa fa-file-archive-o" style="font-size: 50px"></i>
            </div>
            <div>Start fresh from a CMS template</div>
        </div>
    </div>`;

var createSiteModalBody =
  `<div class="modal-body">
        <div class="loading-overlay">
            <div>
                <i class="fa fa-spinner fa-spin loading-spinner" style="font-size:150px"></i>
            </div>
            <div class="loading-text">Working...</div>
        </div>
        <div class="error-overlay">
            <div>
                <i class="fa fa-exclamation-triangle error-icon" style="font-size:50px"></i>
            </div>
            <div class="error-text">Something Went Wrong</div>
            <div class="btn btn-primary">OK</div>
        </div>
        <h3 class="add-modal-section-header">Application Type</h3>
        <div class="tile-container">
            <div class="tile">
                <img class="drupal7" src="img/drupal7.png" data-type="drupal7"/>
            </div>
            <div class="tile">
                <img class="drupal8" src="img/drupal8.png" data-type="drupal8"/>
            </div>
            <div class="tile">
                <img class="wordpress" src="img/wordpress.png" data-type="wordpress"/>
            </div>
        </div>
				<h3 class="add-modal-section-header">Installation Directory</h3>
        <div class="select-folder-container add-site-segment">
            <div class="input-group select-path-folder">
                <span class="input-group-addon" id="basic-addon1"><i class="fa fa-folder-open-o" aria-hidden="true"></i></span>
                <input type="text" readonly class="selected-path-text form-control" placeholder="Path To Install Project" aria-describedby="basic-addon1">
            </div>
        </div>
        <h3 class="add-modal-section-header">Project Name</h3>
        <div class="site-name-container add-site-segment">
            <div class="input-group">
                <input type="text" class="form-control" id="site-name">
            </div>
        </div>
        <div class="hidden">
            <input type="hidden" id="appType">
        </div>
    </div>`;

var createSiteExistingModalBody =
  `<div class="modal-body">
        <div class="loading-overlay">
            <div>
                <i class="fa fa-spinner fa-spin loading-spinner" style="font-size:150px"></i>
            </div>
            <div class="loading-text">Working...</div>
        </div>
        <div class="error-overlay">
            <div>
                <i class="fa fa-exclamation-triangle error-icon" style="font-size:50px"></i>
            </div>
            <div class="error-text">Something Went Wrong</div>
            <div class="btn btn-primary">OK</div>
        </div>
				<h3 class="add-modal-section-header">Project Files</h3>
				<div class="section-description">Select the folder that contains your project's files.</div>
        <div class="select-folder-container add-site-segment">
            <div class="input-group select-path-folder">
                <span class="input-group-addon" id="basic-addon1"><i class="fa fa-folder-open-o" aria-hidden="true"></i></span>
                <input type="text" id="existing-project-path" readonly class="selected-path-text form-control" placeholder="Path To Project Files" aria-describedby="basic-addon1">
            </div>
        </div>
        <h3 class="add-modal-section-header">Project Name</h3>
        <div class="section-description">Enter a name for your project.</div>
        <div class="site-name-container add-site-segment">
            <div class="input-group">
                <input type="text" class="form-control" id="existing-project-name">
            </div>
        </div>
        <h3 class="add-modal-section-header">Project Docroot</h3>
        <div class="section-description">Select the directory from which your site is served. You may skip this field if your site files are in the project root.</div>
        <div class="docroot-container add-site-segment">
            <div class="input-group select-docroot-folder">
                <span class="input-group-addon" id="basic-addon1"><i class="fa fa-folder-open-o" aria-hidden="true"></i></span>
                <input type="text" id="existing-project-docroot" readonly class="selected-docroot-text form-control" placeholder="Project Docroot Path" aria-describedby="basic-addon1">
            </div>
        </div>
    </div>`;

var createSiteModalFooter =
  `<div class="btn btn-primary create-site">Create Project</div>`;

var createSiteExistingModalFooter =
  `<div class="btn btn-primary create-site-from-existing">Create Project</div>`;

/**
 * Basic validation of a hostname based on RFC 2396 Section 3.2.2
 * @param hostname {string} a hostname to validate
 * @return {bool} if hostname has passed validation
 */
function validateHostname(hostname) {
  var promise = new Promise(function(resolve, reject) {
    var hostnameRegex = /^([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*)+(\.([a-zA-Z0-9]+(-[a-zA-Z0-9‌​]+)*))*$/;
    if (hostnameRegex.test(hostname.toLowerCase())) {
      resolve(true);
    } else {
      var error = hostname ? 'Project Name is Invalid.' : 'Project Name Cannot Be Blank.';
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
  var promise = new Promise(function(resolve, reject) {
    var cmsString = cmsType.toLowerCase();
    if (cmsString === 'wordpress' || cmsString === 'drupal7' || cmsString === 'drupal8') {
      resolve(true);
    } else {
      var error = cmsType ? 'CMS Type is Invalid.' : 'Please select a CMS type.';
      reject(error);
    }
  });
  return promise;
}

/**
 * Checks if site has an existing configuration
 */
function checkIfExistingConfig(path) {
  var promise = new Promise(function(resolve, reject) {
    try {
      function checkMessages(messages) {
        if (messages.includes('existing configuration')) {
          var proceed = confirm("An existing DDEV configuration was found in " + path + ". By proceeding, the existing configuration will be updated and replaced.");
          if (proceed) {
            resolve(true);
          } else {
            reject('User Canceled');
          }
        } else {
          resolve(false);
        }
      }
      ddevShell.config(path, 'validName', 'totally invalid docroot that does not exist', null, checkMessages);
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
  var promise = new Promise(function(resolve, reject) {
    distroUpdater.canReadAndWrite(path)
      .then(function(output) {
        resolve(output);
      })
      .catch(function(err) {
        err = err.toString().includes('ENOENT') ? "Cannot find or write to the selected directory." : err;
        reject(err);
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
  if (docroot[0] !== '/') {
    docroot = '/' + docroot;
  }
  var promise = new Promise(function(resolve, reject) {
    distroUpdater.canReadAndWrite(path + docroot)
      .then(function(output) {
        resolve(output);
      })
      .catch(function(err) {
        err = err.toString().includes('ENOENT') ? "Cannot find or write to specified docroot directory." : err;
        reject(err);
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
  var promise = new Promise(function(resolve, reject) {
    var targetCMS;
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
        throw 'No CMS selected';
    }
    distroUpdater.getLocalDistros(cmsPath).then(function(files) {
      files.forEach(function(fileName) {
        if (fileName.indexOf(targetCMS) != -1) {
          resolve(cmsPath + '/' + fileName);
        }
      });
      reject('CMS archive not found in `~/.ddev/CMS`. Restarting the UI will attempt to redownload these files.');
    })
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
  var promise = new Promise(function(resolve, reject) {
    fs.readdir(outputPath, function(err, items) {
      if (err && err.toString().includes('ENOENT')) {
        fs.mkdir(outputPath, function(err) {
          if (err) {
            reject(err);
          }
        });
      } else if (items.length > 0) {
        reject('The path ' + outputPath + ' already exists and is not empty. Please select a new path or try a different project name');
      }
    });
    try {
      tar.x({
        file: tarballPath,
        C: outputPath,
        strip: 1
      }, '', function() {
        resolve(outputPath);
      })
    } catch (err) {
      reject('Cannot extract base CMS file in `~/.ddev/CMS`. Restarting the UI will attempt to redownload them.');
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
    validateInstallPath(targetPath)
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
    validateDocroot(path, docroot)
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
  var promise = new Promise(function(resolve, reject) {
    getCMSTarballPath(cmsType, cmsPath).then(function(CMSTarballPath) {
        targetFolder = targetFolder + "/" + siteName;
        unpackCMSTarball(CMSTarballPath, targetFolder).then(function(unzippedPath) {
          resolve(unzippedPath);
        }).catch(function(err) {
          reject(err);
        });
      })
      .catch(function(err) {
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
  var promise = new Promise(function(resolve, reject) {
    ddevShell.config(workingPath, siteName, docroot, resolve, reject);
  });
  return promise;
}

/**
 * wrapper for ddev start
 * @param workingPath {string} the path of the extracted files to run ddev start in
 * @return {promise} resolves with a successful terminal output from ddev start, rejects with ddev error output
 */
function startSite(workingPath) {
  var promise = new Promise(function(resolve, reject) {
    ddevShell.start(workingPath, resolve, reject);
  });
  return promise;
}

/**
 * prepopulates project name based on name of folder containing project files.
 * NOTE: fails silently if invalid hostname (i.e. has spaces or illegal chars)
 * @param {string} projectPath
 */
function prepopulateProjectName(projectPath) {
  var folderName = projectPath.split('/').pop();
  if (validateHostname(folderName).then(function() {
      $('#existing-project-name').val(folderName);
    }).catch(function(err) {
      //silently fail, to be consistent with CLI, we simply do not prepoulate if invalid hostname
      console.log(err);
    }));
}

/**
 * public function - calls private functions to validate inputs, unpack files, and configure/start site
 * @param name {string} name of site to create
 * @param type {string} type of CMS to install (drupal7, drupal8, wordpress)
 * @param targetPath {string} path to unpack CMS and install site
 */
function addCMS(name, type, targetPath) {
  var cmsPath = "~/.ddev/CMS";
  var workingPath = cmsPath;
  cmsPath = cmsPath.replace('~', os.homedir());
  showLoadingScreen(true);
  validateNewProjectInputs(name, type, targetPath)
    .then(() => {
      showLoadingScreen(true, 'Unzipping files');
      return extractCMSImageToTargetPath(name, type, cmsPath, targetPath);
    })
    .then((newWorkingPath) => {
      showLoadingScreen(true, 'Configuring Project');
      workingPath = newWorkingPath;
      return configureSite(name, workingPath, '');
    })
    .then(() => {
      showLoadingScreen(true, 'Updating Hosts File');
      return ddevShell.hostname(name);
    })
    .then(() => {
      showLoadingScreen(true, 'Starting Project');
      return startSite(workingPath)
    })
    .then((stdout) => {
      if (stdout.toString().indexOf('Starting environment') != -1) {
        resetAddModal();
        alert('Start Process Initiated. It may take a few seconds for the new project to appear on your dashboard.');
      }
    })
    .catch((err) => {
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
    .then(() => {
      return checkIfExistingConfig(targetPath);
    })
    .then(() => {
      showLoadingScreen(true, 'Configuring Project');
      return configureSite(name, targetPath, docroot);
    })
    .then(() => {
      showLoadingScreen(true, 'Updating Hosts File');
      return ddevShell.hostname(name);
    })
    .then(() => {
      showLoadingScreen(true, 'Starting Project');
      return startSite(targetPath)
    })
    .then((stdout) => {
      if (stdout.toString().indexOf('Starting environment') != -1) {
        resetAddModal();
        alert('Start Process Initiated. It may take a few seconds for the new project to appear on your dashboard.');
      }
    })
    .catch((err) => {
      showErrorScreen(true, err.toString());
    });
}

/**
 * Initialization - hook UI and generate markup.
 */
function init() {
  $('body').append(bootstrapModal.createModal('addOptionsDialog', 'Choose a Starting Point', addSiteOptionsModalBody));
  $('body').append(bootstrapModal.createModal('distroModal', 'Create a New Project', createSiteModalBody, createSiteModalFooter));
  $('body').append(bootstrapModal.createModal('existingFilesModal', 'Create a Project From Existing Files', createSiteExistingModalBody, createSiteExistingModalFooter));
  $(document).on('click', '.add', function() {
    resetAddModal();
    alert('In order to add a new project, DDEV requires elevated permissions to modify your Hosts file. You may be prompted for your username and password to continue.');
    var command = 'version';
    ddevShell.sudo(command)
      .then(function() {
        $('#addOptionsDialog').modal();
      })
      .catch(function(err) {
        alert(err);
      });
  });
  $(document).on('click', '.start-from-template', function() {
    resetAddModal();
    $('#addOptionsDialog').modal('hide');
    $('#distroModal').modal();
  });

  $(document).on('click', '.start-from-files', function() {
    resetAddModal();
    $('#addOptionsDialog').modal('hide');
    $('#existingFilesModal').modal();
  });

  $(document).on('click', '.select-path-folder', function() {
    var path = dialog.showOpenDialog({
      properties: ['openDirectory']
    });
    if (path) {
      $('.selected-path-text').val(path[0]);
      $('.selected-docroot-text').val(path[0]);
      prepopulateProjectName(path[0]);
    }
  });

  $(document).on('click', '.select-docroot-folder', function() {
    var projectRoot = $('.selected-path-text').val();
    var path = dialog.showOpenDialog({
      defaultPath: projectRoot,
      properties: ['openDirectory']
    });
    if (path) {
      if (path[0].includes(projectRoot)) {
        $('.selected-docroot-text').val(path[0]);
      } else {
        document.activeElement.blur();
        showErrorScreen(true, "Docroot must be in the selected project folder.");
      }
    }
  });

  $(document).on('click', '.tile img', function() {
    $('#appType').val($(this).data('type')).trigger('change');
  });
  $(document).on('change', '#appType', function() {
    $('.tile img').removeClass('active');
    if ($(this).val()) {
      $('.' + $(this).val()).addClass('active');
    }
  });

  $(document).on('click', '.create-site', function() {
    var type = $('#appType').val();
    var targetPath = $('.selected-path-text').val();
    var name = $('#site-name').val();
    addCMS(name, type, targetPath);
    return false;
  });

  $(document).on('click', '.create-site-from-existing', function() {
    var name = $('#existing-project-name').val();
    var path = $('#existing-project-path').val();
    var docroot = $('#existing-project-docroot').val();
    docroot = docroot.replace(path, '');
    if (docroot[0] === '/') {
      docroot = docroot.substr(1);
    }
    addCMSFromExisting(name, path, docroot);
  });
}

module.exports.init = init;
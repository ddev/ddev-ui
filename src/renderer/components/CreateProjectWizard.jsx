import React from 'react';
import electron, { remote as _remote } from 'electron';
import { x } from 'tar';
import { readdir, mkdir } from 'fs';
import { homedir } from 'os';

import { start, hostname as _hostname } from 'ddev-shell';
import { getLocalDistros } from 'distro-updater';

import {
  showLoadingScreen,
  showErrorScreen,
  validateHostname,
  validateCMSType,
  validateInstallPath,
  validateDocroot,
  configureSite,
  checkIfExistingConfig,
} from 'helpers';

import ProjectSettings from 'Components/CreateProjectWizard/ProjectSettings';
import ContainerSettings from 'Components/CreateProjectWizard/ContainerSettings';
import CmsSettings from 'Components/CreateProjectWizard/CmsSettings';
import WizardSteps from 'Components/CreateProjectWizard/WizardSteps';

const remote = _remote || electron;
const { dialog } = remote;

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
      case 'drupal6':
        targetCMS = 'drupal-6';
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
 * @param type {string} type of CMS to install (drupal6, drupal7, drupal8, wordpress)
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
      return start(
        workingPath,
        data => {
          const res = data.toString();
          if (res.includes('Successfully started')) {
            history.push(`/project/${name}`);
          } else if (res.includes('Process Exited')) {
            showLoadingScreen(false);
          } else if (!res.includes('[1A')) {
            showLoadingScreen(true, res);
          }
        },
        err => {
          console.error(err);
          showErrorScreen(true, err.toString());
        }
      );
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
    .then(shouldConfig => {
      if (shouldConfig) {
        showLoadingScreen(true, 'Configuring Project');
        return configureSite(name, targetPath, docroot);
      }
      return Promise.resolve(true);
    })
    .then(() => {
      showLoadingScreen(true, 'Updating Hosts File');
      return _hostname(name);
    })
    .then(() => {
      showLoadingScreen(true, 'Starting Project');
      return start(
        targetPath,
        data => {
          const res = data.toString();
          if (res.includes('Successfully started')) {
            history.push(`/project/${name}`);
          } else if (res.includes('Process Exited')) {
            showLoadingScreen(false);
          } else if (!res.includes('[1A')) {
            showLoadingScreen(true, res);
          }
        },
        err => {
          console.error(err);
          showErrorScreen(true, err.toString());
        }
      );
    })
    .catch(err => {
      showErrorScreen(true, err.toString());
    });
}

class CreateProjectWizard extends React.Component {
  state = {
    step: '1',
    name: '',
    installtype: 'new',
    path: '',
    docroot: '',
    containerType: 'default',
    phpVersion: '7.1',
    webServer: 'nginx',
    dbType: 'MariaDB',
    enableXDebug: false,
    httpPort: 80,
    httpsPort: 443,
    cmsType: 'wordpress',
    cmsVersion: 'latest',
  };

  handleInputChange = e => {
    const { target } = e;
    const { type, checked, name } = target;
    let { value } = target;

    value = type === 'checkbox' ? checked : value;

    this.setState({
      [name]: value,
    });
  };

  handleNextStep = e => {
    const curStep = $(e.currentTarget).closest('.setup-content');
    const curInputs = curStep.find("input[type='text'],input[type='url'],select");
    let isValid = true;

    $('.form-group').removeClass('has-error');
    for (let i = 0; i < curInputs.length; i += 1) {
      if (!curInputs[i].validity.valid) {
        isValid = false;
        $(curInputs[i])
          .closest('.form-group')
          .addClass('has-error');
      }
    }

    if (isValid) {
      this.setState({ step: e.currentTarget.getAttribute('step') });
    }
  };

  handlePrevStep = e => {
    this.setState({ step: e.currentTarget.getAttribute('step') });
  };

  handleInstallTypeUpdate = e => {
    const type = e.currentTarget.getAttribute('installtype');
    this.setState(prevState => {
      if (prevState.installtype !== type) {
        return { installtype: type };
      }
      return { prevState };
    });
  };

  handlePathSetting = () => {
    const projectRoot = this.state.path;
    const path = dialog.showOpenDialog({
      defaultPath: projectRoot,
      properties: ['openDirectory'],
    });
    if (path) {
      this.setState({ path: path[0], docroot: path[0] });
      if (this.state.installtype !== 'new') {
        const name = path[0].match(/([^/]*)\/*$/)[1];
        this.setState({ name });
      }
    }
  };

  handleDocrootSetting = () => {
    const projectRoot = this.state.docroot;
    const docroot = dialog.showOpenDialog({
      defaultPath: projectRoot,
      properties: ['openDirectory'],
    });
    if (docroot) {
      if (docroot[0].includes(projectRoot)) {
        this.setState({ docroot: docroot[0] });
      } else {
        alert('Docroot must be in the selected project folder.');
      }
    }
  };

  handleContainerTypeUpdate = e => {
    const type = e.currentTarget.getAttribute('containertype');
    this.setState(prevState => {
      if (prevState.containerType !== type) {
        return { containerType: type };
      }
      return { prevState };
    });
  };

  handleEnableXDebugUpdate = () => {
    this.setState(prevState => ({ enableXDebug: !prevState.enableXDebug }));
  };

  handleCmsUpdate = e => {
    e.preventDefault();
    const cms = e.currentTarget.getAttribute('cms');
    this.setState(prevState => {
      if (prevState.cmsType !== cms) {
        return { cmsType: cms };
      }
      return { prevState };
    });
  };

  handleProjectCreation = e => {
    e.preventDefault();
    if (this.state.installtype === 'new') {
      // Temp filter for drupal
      // TODO: make the version allow for any version of a CMS
      let cms = '';
      if (this.state.cmsType === 'drupal') {
        const version = this.state.cmsVersion === 'latest' ? '8' : this.state.cmsVersion;
        cms = this.state.cmsType + version;
      } else {
        cms = this.state.cmsType;
      }
      addCMS(this.state.name, cms, this.state.path, this.props.history);
    } else {
      let { docroot } = this.state;
      docroot = docroot.replace(this.state.path, '');
      if (docroot[0] === '/') {
        docroot = docroot.substr(1);
      }
      addCMSFromExisting(this.state.name, this.state.path, docroot, this.props.history);
    }
  };

  render() {
    return (
      <div className="create-project-wizard">
        <form className="" onSubmit={this.handleProjectCreation} key="createProjectForm">
          {/* Step 1 */}
          {this.state.step === '1' && (
            <ProjectSettings
              path={this.state.path}
              projectName={this.state.name}
              installtype={this.state.installtype}
              docroot={this.state.docroot}
              history={this.props.history}
              handleInputChange={this.handleInputChange}
              handleNextStep={this.handleNextStep}
              handlePathSetting={this.handlePathSetting}
              handleDocrootSetting={this.handleDocrootSetting}
              handleInstallTypeUpdate={this.handleInstallTypeUpdate}
            />
          )}

          {/* Step 2 */}
          {this.state.step === '2' && (
            <ContainerSettings
              containerType={this.state.containerType}
              phpVersion={this.state.phpVersion}
              webServer={this.state.webServer}
              dbType={this.state.dbType}
              enableXDebug={this.state.enableXDebug}
              httpPort={this.state.httpPort}
              httpsPort={this.state.httpsPort}
              handleInputChange={this.handleInputChange}
              handleNextStep={this.handleNextStep}
              handlePrevStep={this.handlePrevStep}
              handleContainerTypeUpdate={this.handleContainerTypeUpdate}
              handleEnableXDebugUpdate={this.handleEnableXDebugUpdate}
            />
          )}

          {/* Step 3 */}
          {this.state.step === '3' && (
            <CmsSettings
              cmsType={this.state.cmsType}
              cmsVersion={this.state.cmsVersion}
              handleInputChange={this.handleInputChange}
              handlePrevStep={this.handlePrevStep}
              handleCmsUpdate={this.handleCmsUpdate}
            />
          )}
        </form>
        {/* Steps */}
        <WizardSteps activeStep={this.state.step} />
      </div>
    );
  }
}

export default CreateProjectWizard;

import React from 'react';
import electron, { remote as _remote } from 'electron';

import ProjectSettings from './CreateProjectWizard/ProjectSettings';
import ContainerSettings from './CreateProjectWizard/ContainerSettings';
import CmsSettings from './CreateProjectWizard/CmsSettings';
import WizardSteps from './CreateProjectWizard/WizardSteps';
import Status from './CreateProjectWizard/Status';

import { addCMS, addCMSFromExisting } from '../modules/cms-installer';

const remote = _remote || electron;
const { dialog } = remote;

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

  handleEnableXDebugUpdate = e => {
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
      // this.props.history.push(`/project/${this.state.name}`);
    } else {
      let { docroot } = this.state;
      docroot = docroot.replace(this.state.path, '');
      if (docroot[0] === '/') {
        docroot = docroot.substr(1);
      }
      addCMSFromExisting(this.state.name, this.state.path, docroot, this.props.history);
      // this.props.history.push(`/project/${this.state.name}`);
    }
  };

  render() {
    return (
      <div className="create-project-wizard">
        <form className="" onSubmit={this.handleProjectCreation} key="createProjectForm">
          <Status />

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
        <WizardSteps />
      </div>
    );
  }
}

export default CreateProjectWizard;

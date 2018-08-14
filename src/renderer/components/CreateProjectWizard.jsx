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

  componentDidMount() {
    const navListItems = $('div.setup-panel div a');
    const allWells = $('.setup-content');
    const allNextBtn = $('.nextBtn');
    const allBackBtn = $('.backBtn');

    allWells.hide();

    navListItems.click(function(e) {
      e.preventDefault();
      const $target = $($(this).attr('href'));
      const $item = $(this);

      if (!$item.hasClass('disabled')) {
        navListItems.removeClass('btn-outline-primary').addClass('btn-outline-secondary');
        $item.removeClass('btn-outline-secondary').addClass('btn-outline-primary');
        allWells.hide();
        $target.show();
        $target.find('input:eq(0)').focus();
      }
    });

    allNextBtn.click(function() {
      const curStep = $(this).closest('.setup-content');
      const curStepBtn = curStep.attr('id');
      const nextStepWizard = $(`div.setup-panel div a[href="#${curStepBtn}"]`)
        .parent()
        .next()
        .children('a');
      const curInputs = curStep.find("input[type='text'],input[type='url'],select");
      let isValid = true;

      // console.log([curStep, curStepBtn, nextStepWizard]);

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
        nextStepWizard.removeAttr('disabled').trigger('click');
      }
    });

    allBackBtn.click(function() {
      const curStep = $(this).closest('.setup-content');
      const curStepBtn = curStep.attr('id');
      const prevStepWizard = $(`div.setup-panel div a[href="#${curStepBtn}"]`)
        .parent()
        .prev()
        .children('a');
      console.log([curStep, curStepBtn, prevStepWizard]);
      prevStepWizard.removeAttr('disabled').trigger('click');
    });

    $('div.setup-panel div a.btn-outline-primary').trigger('click');
  }

  handleNameUpdate = e => {
    this.setState({ name: e.target.value });
  };

  handleInstallTypeUpdate = e => {
    const type = e.currentTarget.getAttribute('installtype');
    const target = $(e.currentTarget);
    this.setState(prevState => {
      if (prevState.installtype !== type) {
        target.siblings().removeClass('active');
        target.addClass('active');
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
    const target = $(e.currentTarget);
    this.setState(prevState => {
      if (prevState.containerType !== type) {
        target.siblings().removeClass('active');
        target.addClass('active');
        return { containerType: type };
      }
      return { prevState };
    });
  };

  handlePhpVersionUpdate = e => {
    this.setState({ phpVersion: e.target.value });
  };

  handleWebServerUpdate = e => {
    this.setState({ webServer: e.target.value });
  };

  handleHttpPortUpdate = e => {
    this.setState({ httpPort: e.target.value });
  };

  handleHttpsPortUpdate = e => {
    this.setState({ httpsPort: e.target.value });
  };

  handleEnableXDebugUpdate = e => {
    this.setState(prevState => ({ enableXDebug: !prevState.enableXDebug }));
  };

  handleCmsUpdate = e => {
    e.preventDefault();
    const cms = e.currentTarget.getAttribute('cms');
    const target = $(e.currentTarget);
    this.setState(prevState => {
      if (prevState.cmsType !== cms) {
        target.siblings().removeClass('active');
        target.addClass('active');
        return { cmsType: cms };
      }
      return { prevState };
    });
  };

  handleCmsVersionUpdate = e => {
    this.setState({ cmsVersion: e.target.value });
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
        <form className="" onSubmit={this.handleProjectCreation}>
          <Status />
          {/* Step 1 */}
          <ProjectSettings
            path={this.state.path}
            projectName={this.state.name}
            installtype={this.state.installtype}
            docroot={this.state.docroot}
            history={this.props.history}
            handleNameUpdate={this.handleNameUpdate}
            handlePathSetting={this.handlePathSetting}
            handleDocrootSetting={this.handleDocrootSetting}
            handleInstallTypeUpdate={this.handleInstallTypeUpdate}
          />
          {/* Step 2 */}
          <ContainerSettings
            containerType={this.state.containerType}
            phpVersion={this.state.phpVersion}
            webServer={this.state.webServer}
            dbType={this.state.dbType}
            enableXDebug={this.state.enableXDebug}
            httpPort={this.state.httpPort}
            httpsPort={this.state.httpsPort}
            handleContainerTypeUpdate={this.handleContainerTypeUpdate}
            handlePhpVersionUpdate={this.handlePhpVersionUpdate}
            handleWebServerUpdate={this.handleWebServerUpdate}
            handleEnableXDebugUpdate={this.handleEnableXDebugUpdate}
            handleHttpPortUpdate={this.handleHttpPortUpdate}
            handleHttpsPortUpdate={this.handleHttpsPortUpdate}
          />
          {/* Step 3 */}
          <CmsSettings
            cmsType={this.state.cmsType}
            cmsVersion={this.state.cmsVersion}
            handleCmsUpdate={this.handleCmsUpdate}
            handleCmsVersionUpdate={this.handleCmsVersionUpdate}
          />
        </form>
        {/* Steps */}
        <WizardSteps />
      </div>
    );
  }
}

export default CreateProjectWizard;

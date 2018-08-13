import React from 'react';
import electron, { remote as _remote } from 'electron';

const remote = _remote || electron;
const { dialog } = remote;

/* eslint-disable no-undef,global-require,import/no-dynamic-require */
const drupalLogo = require(`${__static}/img/druplicon-vector.svg`);
const wordpressLogo = require(`${__static}/img/wordpress-vector.svg`);
const typo3Logo = require(`${__static}/img/typo3.svg`);
const backdropLogo = require(`${__static}/img/Backdrop-vector.svg`);
const phpLogo = require(`${__static}/img/PHPApp.svg`);
/* eslint-enable no-undef,global-require,import/no-dynamic-require */

class CreateProjectWizard extends React.Component {
  state = {
    step: 'step-1',
    name: '',
    installtype: '',
    path: '',
    containerType: 'default',
    phpVersion: '7.1',
    webServer: 'nginx',
    dbType: 'MariaDB',
    enableXDebug: false,
    httpPort: 80,
    httpsPort: 443,
    cmsType: 'none',
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

      console.log([curStep, curStepBtn, nextStepWizard]);

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
    const projectRoot = $('.selected-path-text').val();
    const path = dialog.showOpenDialog({
      defaultPath: projectRoot,
      properties: ['openDirectory'],
    });
    if (path) {
      if (path[0].includes(projectRoot)) {
        this.setState({ path: path[0] });
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
    console.log(this.state);
  };

  render() {
    return (
      <div className="create-project-wizard">
        <form onSubmit={this.handleProjectCreation}>
          {/* Step 1 */}
          <div className="setup-content" id="step-1">
            <div className="row">
              <div className="col-md-12">
                <h3 className="text-center">Project Setup</h3>
                <div className="form-group">
                  <label className="control-label" htmlFor="projectName">
                    Project Name
                  </label>
                  <input
                    maxLength="200"
                    type="text"
                    required="required"
                    className="form-control form-control-lg"
                    placeholder="my-new-project"
                    value={this.state.name}
                    name="project-name"
                    id="projectName"
                    onChange={this.handleNameUpdate}
                  />
                </div>
                <div className="form-group form-row">
                  <label className="control-label" htmlFor="installType">
                    Is your project new or existing
                  </label>
                  <div className="btn-group w-100" id="installType">
                    <button
                      className="btn btn-outline-secondary btn-lg"
                      installtype="new"
                      type="button"
                      onClick={this.handleInstallTypeUpdate}
                    >
                      New Install
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-lg"
                      installtype="existing"
                      type="button"
                      onClick={this.handleInstallTypeUpdate}
                    >
                      Existing Install
                    </button>
                  </div>
                </div>
                <div className="form-group form-row">
                  <div className="col">
                    <label className="control-label" htmlFor="localDomain">
                      Local project domain
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        disabled="disabled"
                        readOnly
                        className="form-control"
                        placeholder="my-new-project"
                        value={this.state.name}
                        id="localDomain"
                      />
                      <div className="input-group-append">
                        <div className="input-group-text">.ddev.local</div>
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <label className="control-label" htmlFor="localPath">
                      Local path for install
                    </label>
                    <div
                      className="input-group"
                      onClick={this.handlePathSetting}
                      onKeyPress={this.handlePathSetting}
                      role="button"
                      tabIndex="0"
                    >
                      <input
                        maxLength="100"
                        type="text"
                        disabled="disabled"
                        readOnly
                        required="required"
                        className="selected-path-text form-control"
                        placeholder="~/Local Sites/"
                        value={this.state.path}
                        id="localPath"
                      />
                      <div className="input-group-append">
                        <div className="input-group-text">
                          <i className="fa fa-folder-open-o" aria-hidden="true" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-group clearix">
                  <button
                    className="btn btn-outline-secondary btn-sm pull-left"
                    type="button"
                    onClick={e => {
                      e.preventDefault();
                      this.props.history.goBack();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-outline-primary nextBtn btn-sm pull-right"
                    type="button"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Step 2 */}
          <div className="setup-content" id="step-2">
            <div className="row">
              <div className="col-md-12">
                <h3>Container Settings</h3>
                <div className="form-group form-row">
                  <label className="control-label" htmlFor="containerType">
                    Use default or custom configuration?
                  </label>
                  <div className="btn-group w-100" id="containerType">
                    <button
                      className="btn btn-outline-secondary btn-lg active"
                      containertype="default"
                      type="button"
                      onClick={this.handleContainerTypeUpdate}
                    >
                      Default
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-lg"
                      containertype="custom"
                      type="button"
                      onClick={this.handleContainerTypeUpdate}
                    >
                      Custom
                    </button>
                  </div>
                </div>
                {this.state.containerType === 'default' ? (
                  <div className="form-group">
                    <p className="text-center">
                      PHP: <span className="strong"> {this.state.phpVersion}</span> | Web Server:
                      <span className="strong"> {this.state.webServer}</span> | DB:{' '}
                      <span className="strong"> {this.state.dbType}</span>
                    </p>
                  </div>
                ) : (
                  <div className="">
                    <div className="form-inline">
                      <div className="form-group form-row">
                        <label className="control-label mr-2" htmlFor="phpVersion">
                          PHP Version:
                        </label>
                        <select
                          name="php-version"
                          id="phpVersion"
                          className="form-control form-control-lg"
                          value={this.state.phpVersion}
                          onChange={this.handlePhpVersionUpdate}
                        >
                          <option value="5.6">5.6</option>
                          <option value="7.1">7.1</option>
                          <option value="7.2">7.2</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="control-label mr-2" htmlFor="webServer">
                          Web Server:
                        </label>
                        <select
                          name="web-server"
                          id="webServer"
                          className="form-control form-control-lg"
                          value={this.state.webServer}
                          onChange={this.handleWebServerUpdate}
                        >
                          <option value="nginx">nginx</option>
                          <option value="apache">apache</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
                <div className="clearix">
                  <p>
                    <a
                      className=""
                      data-toggle="collapse"
                      href="#advancedContainerOptions"
                      role="button"
                      aria-expanded="false"
                      aria-controls="advancedContainerOptions"
                    >
                      Advanced Options
                    </a>
                  </p>
                  <div className="collapse" id="advancedContainerOptions">
                    <div className="form-inline">
                      <div className="form-group col-6">
                        <label className="control-label mr-2" htmlFor="enableXDebug">
                          Enable XDebug:
                        </label>
                        <input
                          maxLength="200"
                          type="checkbox"
                          className="form-control form-control-lg"
                          name="enable-x-debug"
                          id="enableXDebug"
                          defaultChecked={this.state.enableXDebug}
                          onChange={this.handleEnableXDebugUpdate}
                        />
                      </div>
                      <div className="form-group col-6">
                        <div className="row">
                          <label
                            className="control-label col-sm-6 justify-content-end"
                            htmlFor="httpPorts"
                          >
                            Ports:
                          </label>
                          <div id="httpPorts" className="col-sm-6">
                            <div className="row">
                              <div className="col-sm-6">
                                <label
                                  className="control-label justify-content-start"
                                  htmlFor="httpPort"
                                >
                                  HTTP:
                                </label>
                                <input
                                  maxLength="3"
                                  type="text"
                                  className="w-100"
                                  placeholder="80"
                                  value={this.state.httpPort}
                                  name="http-port"
                                  id="httpPort"
                                  onChange={this.handleHttpPortUpdate}
                                />
                              </div>
                              <div className="col-sm-6">
                                <label
                                  className="control-label justify-content-start"
                                  htmlFor="httpsPort"
                                >
                                  HTTPS:
                                </label>
                                <input
                                  maxLength="3"
                                  type="text"
                                  className="w-100"
                                  placeholder="443"
                                  value={this.state.httpsPort}
                                  name="https-port"
                                  id="httpsPort"
                                  onChange={this.handleHttpsPortUpdate}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-group clearix">
                  <button
                    className="btn btn-outline-secondary backBtn btn-sm pull-left"
                    type="button"
                  >
                    Back
                  </button>
                  <button
                    className="btn btn-outline-primary nextBtn btn-sm pull-right"
                    type="button"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Step 3 */}
          <div className="setup-content" id="step-3">
            <div className="row">
              <div className="col-md-12">
                <h3>Platform Setup</h3>
                <div className="form-group">
                  <div className="card-deck">
                    <div className="card">
                      <a
                        href="!#"
                        className="text-center"
                        cms="drupal"
                        onClick={this.handleCmsUpdate}
                      >
                        <img src={drupalLogo} alt="Drupal" className="" />
                      </a>
                    </div>
                    <div className="card">
                      <a
                        href="!#"
                        className="text-center"
                        cms="wordpress"
                        onClick={this.handleCmsUpdate}
                      >
                        <img src={wordpressLogo} alt="WordPress" className="" />
                      </a>
                    </div>
                    <div className="card">
                      <a
                        href="!#"
                        className="text-center"
                        cms="backdrop"
                        onClick={this.handleCmsUpdate}
                      >
                        <img src={backdropLogo} alt="BackDrop" className="" />
                      </a>
                    </div>
                    <div className="card">
                      <a
                        href="!#"
                        className="text-center"
                        cms="typo3"
                        onClick={this.handleCmsUpdate}
                      >
                        <img src={typo3Logo} alt="Typo3" className="" />
                      </a>
                    </div>
                    <div className={`card ${this.state.cmsType === 'none' ? 'active' : ''}`}>
                      <a
                        href="!#"
                        className="text-center"
                        cms="none"
                        onClick={this.handleCmsUpdate}
                      >
                        <img src={phpLogo} alt="PHP Application" className="" />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  {this.state.cmsType === 'drupal' && (
                    <div className="">
                      <div className="form-inline">
                        <div className="form-group form-row">
                          <label className="control-label mr-2" htmlFor="cmsVersion">
                            Version:
                          </label>
                          <select
                            name="cms-version"
                            id="cmsVersion"
                            className="form-control form-control-lg"
                            value={this.state.cmsVersion}
                            onChange={this.handleCmsVersionUpdate}
                          >
                            <option value="7">7</option>
                            <option value="8">8</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="form-group clearix">
                  <button
                    className="btn btn-outline-secondary backBtn btn-sm pull-left"
                    type="button"
                  >
                    Back
                  </button>
                  <button className="btn btn-primary btn-sm pull-right" type="submit">
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Steps */}
        <div className="stepwizard fixed-bottom">
          <div className="stepwizard-row form-row h-100 btn-breadcrumb align-items-center setup-panel clearfix">
            {/* Step 1 */}
            <div className="stepwizard-step col-4">
              <a href="#step-1" type="button" className="btn btn-outline-primary btn-circle">
                1
              </a>
              <span>Project Setup</span>
            </div>
            {/* Step 2 */}
            <div className="stepwizard-step col-4">
              <a
                href="#step-2"
                type="button"
                className="btn btn-outline-secondary btn-circle"
                disabled
              >
                2
              </a>
              <span>Container Settings</span>
            </div>
            {/* Step 3 */}
            <div className="stepwizard-step col-4">
              <a
                href="#step-3"
                type="button"
                className="btn btn-outline-secondary btn-circle"
                disabled
              >
                3
              </a>
              <span>Platform Setup</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateProjectWizard;

import React from 'react';

class ContainerSettings extends React.PureComponent {
  render() {
    return (
      <div className="setup-content" id="step-2" key="createProjectStep2">
        <div className="row">
          <div className="col-md-12">
            <h3 className="text-center">Container Settings</h3>
            <div className="form-group form-row">
              <label className="control-label" htmlFor="containerType">
                Use default or custom configuration?
              </label>
              <div className="btn-group w-100" id="containerType">
                <button
                  className={`btn btn-outline-secondary btn-lg ${
                    this.props.containerType === 'default' ? 'active' : ''
                  }`}
                  containertype="default"
                  type="button"
                  onClick={this.props.handleContainerTypeUpdate}
                >
                  Default
                </button>
                <button
                  className={`btn btn-outline-secondary btn-lg ${
                    this.props.containerType === 'custom' ? 'active' : ''
                  }`}
                  containertype="custom"
                  type="button"
                  onClick={this.props.handleContainerTypeUpdate}
                  disabled
                >
                  Custom
                </button>
              </div>
            </div>
            {this.props.containerType === 'default' ? (
              <div className="form-group">
                <p className="text-center">
                  PHP: <span className="strong"> {this.props.phpVersion}</span> | Web Server:
                  <span className="strong"> {this.props.webServer}</span> | DB:{' '}
                  <span className="strong"> {this.props.dbType}</span>
                </p>
              </div>
            ) : (
              <div className="form-group">
                <div className="form-inline">
                  <div className="form-group form-row">
                    <label className="control-label mr-2" htmlFor="phpVersion">
                      PHP Version:
                    </label>
                    <select
                      name="phpVersion"
                      id="phpVersion"
                      className="form-control form-control-lg"
                      value={this.props.phpVersion}
                      onChange={this.props.handleInputChange}
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
                      name="webServer"
                      id="webServer"
                      className="form-control form-control-lg"
                      value={this.props.webServer}
                      onChange={this.props.handleInputChange}
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
                      defaultChecked={this.props.enableXDebug}
                      onChange={this.props.handleEnableXDebugUpdate}
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
                              value={this.props.httpPort}
                              name="httpPort"
                              id="httpPort"
                              onChange={this.props.handleInputChange}
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
                              value={this.props.httpsPort}
                              name="httpsPort"
                              id="httpsPort"
                              onChange={this.props.handleInputChange}
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
                className="btn btn-outline-secondary pull-left"
                step="1"
                onClick={this.props.handlePrevStep}
                type="button"
              >
                Back
              </button>
              <button
                className="btn btn-outline-primary pull-right"
                step="3"
                onClick={this.props.handleNextStep}
                type="button"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ContainerSettings;

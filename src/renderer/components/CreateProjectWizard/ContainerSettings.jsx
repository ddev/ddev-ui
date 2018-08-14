import React from 'react';

class ContainerSettings extends React.Component {
  render() {
    return (
      <div className="setup-content" id="step-2">
        <div className="row">
          <div className="col-md-12">
            <h3 className="text-center">Container Settings</h3>
            <div className="form-group form-row">
              <label className="control-label" htmlFor="containerType">
                Use default or custom configuration?
              </label>
              <div className="btn-group w-100" id="containerType">
                <button
                  className="btn btn-outline-secondary btn-lg active"
                  containertype="default"
                  type="button"
                  onClick={this.props.handleContainerTypeUpdate}
                >
                  Default
                </button>
                <button
                  className="btn btn-outline-secondary btn-lg"
                  containertype="custom"
                  type="button"
                  onClick={this.props.handleContainerTypeUpdate}
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
                      value={this.props.phpVersion}
                      onChange={this.props.handlePhpVersionUpdate}
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
                      value={this.props.webServer}
                      onChange={this.props.handleWebServerUpdate}
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
                              name="http-port"
                              id="httpPort"
                              onChange={this.props.handleHttpPortUpdate}
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
                              name="https-port"
                              id="httpsPort"
                              onChange={this.props.handleHttpsPortUpdate}
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
              <button className="btn btn-outline-secondary backBtn pull-left" type="button">
                Back
              </button>
              <button className="btn btn-outline-primary nextBtn pull-right" type="button">
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

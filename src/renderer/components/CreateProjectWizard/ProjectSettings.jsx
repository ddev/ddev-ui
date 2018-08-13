import React from 'react';

class ProjectSettings extends React.Component {
  render() {
    return (
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
                value={this.props.projectName}
                name="project-name"
                id="projectName"
                onChange={this.props.handleNameUpdate}
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
                  onClick={this.props.handleInstallTypeUpdate}
                >
                  New Install
                </button>
                <button
                  className="btn btn-outline-secondary btn-lg"
                  installtype="existing"
                  type="button"
                  onClick={this.props.handleInstallTypeUpdate}
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
                    value={this.props.projectName}
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
                  onClick={this.props.handlePathSetting}
                  onKeyPress={this.props.handlePathSetting}
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
                    value={this.props.path}
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
              <button className="btn btn-outline-primary nextBtn btn-sm pull-right" type="button">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProjectSettings;

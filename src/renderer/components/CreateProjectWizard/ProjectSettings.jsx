import React from 'react';

const Name = props => (
  <div className="form-group clearix" key="projectName">
    <label className="control-label" htmlFor="projectName" key="projectNameLabel">
      Project Name
    </label>
    <input
      maxLength="200"
      type="text"
      required="required"
      className="form-control form-control-lg"
      placeholder="my-new-project"
      value={props.projectName}
      name="name"
      id="projectName"
      onChange={props.handleInputChange}
      key="projectName"
      autoFocus
    />
    <small className="form-text text-muted">
      Name or Domain of your project. (In a url friendly format.)
    </small>
    <small className="form-text text-muted">
      <b>Local URL: </b>
      <span className="text-primary" key="projectNameExample">{`${
        props.projectName ? props.projectName : 'my-new-project'
      }.ddev.local`}</span>
    </small>
  </div>
);

class ProjectSettings extends React.Component {
  render() {
    return (
      <div className="setup-content" id="step-1" key="createProjectStep1">
        <div className="row">
          <div className="col-md-12">
            <h3 className="text-center">Project Setup</h3>
            <div className="form-group form-row" key="installType">
              <label className="control-label mx-auto" htmlFor="installType">
                Is your project new or existing
              </label>
              <div className="btn-group w-100" id="installType">
                <button
                  className={`btn btn-outline-secondary btn-lg ${
                    this.props.installtype === 'new' ? 'active' : ''
                  }`}
                  installtype="new"
                  type="button"
                  onClick={this.props.handleInstallTypeUpdate}
                >
                  New Install
                </button>
                <button
                  className={`btn btn-outline-secondary btn-lg ${
                    this.props.installtype === 'existing' ? 'active' : ''
                  }`}
                  installtype="existing"
                  type="button"
                  onClick={this.props.handleInstallTypeUpdate}
                >
                  Existing Install
                </button>
              </div>
              <div className="form-row w-100 mt-2">
                <p className="col text-center small mb-1">Create a fresh project</p>
                <p className="col text-center small mb-1">Connect existing project</p>
              </div>
            </div>
            <div className="form-group form-row" key="installPaths">
              <div className={this.props.installtype === 'new' ? 'col' : 'col-md-6'}>
                <label className="control-label" htmlFor="localPath">
                  Local Path
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
                    // disabled="disabled"
                    readOnly
                    required="required"
                    className="form-control disabled"
                    placeholder="~/Sites/"
                    value={this.props.path}
                    id="localPath"
                    name="path"
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <i className="fa fa-folder-open-o" aria-hidden="true" />
                    </div>
                  </div>
                </div>
                <small className="form-text text-muted">
                  {this.props.installtype === 'new'
                    ? 'Select the directory where you would like your new project installed.'
                    : "Select the directory that contains your project's files."}
                </small>
              </div>
              {this.props.installtype === 'existing' && (
                <div className="col-md-6">
                  <label className="control-label" htmlFor="localDocroot">
                    Project Docroot
                  </label>
                  <div
                    className="input-group"
                    onClick={this.props.handleDocrootSetting}
                    onKeyPress={this.props.handleDocrootSetting}
                    role="button"
                    tabIndex="0"
                  >
                    <input
                      maxLength="100"
                      type="text"
                      // disabled="disabled"
                      readOnly
                      className="form-control"
                      placeholder="~/Sites/my-new-project/docroot"
                      value={this.props.docroot}
                      id="localDocroot"
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">
                        <i className="fa fa-folder-open-o" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                  <small className="form-text text-muted">
                    Select the directory from which your site is served. You may skip this field if
                    your site files are in the project root.
                  </small>
                </div>
              )}
            </div>
            <Name {...this.props} />
            <div className="form-group clearix" key="step1nav">
              <button
                className="btn btn-outline-secondary pull-left"
                type="button"
                onClick={e => {
                  e.preventDefault();
                  this.props.history.goBack();
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-outline-primary pull-right"
                onClick={this.props.handleNextStep}
                step="2"
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

export default ProjectSettings;

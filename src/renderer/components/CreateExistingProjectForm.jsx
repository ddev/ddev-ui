import React from 'react';

const CreateExistingProjectForm = () => (
  <div className="modal-body">
    <div className="loading-overlay">
      <div>
        <i className="fa fa-spinner fa-spin loading-spinner" />
      </div>
      <div className="loading-text">Working...</div>
    </div>
    <div className="error-overlay">
      <div>
        <i className="fa fa-exclamation-triangle error-icon" />
      </div>
      <div className="error-text">Something Went Wrong</div>
      <div className="btn btn-primary">OK</div>
    </div>
    <h3 className="add-modal-section-header">Project Files</h3>
    <div className="section-description">Select the folder that contains your project's files.</div>
    <div className="select-folder-container add-site-segment">
      <div className="input-group select-path-folder">
        <span className="input-group-addon" id="basic-addon1">
          <i className="fa fa-folder-open-o" aria-hidden="true" />
        </span>
        <input
          type="text"
          id="existing-project-path"
          readOnly
          className="selected-path-text form-control"
          placeholder="Path To Project Files"
          aria-describedby="basic-addon1"
        />
      </div>
    </div>
    <h3 className="add-modal-section-header">Project Name</h3>
    <div className="section-description">Enter a name for your project.</div>
    <div className="site-name-container add-site-segment">
      <div className="input-group">
        <input type="text" className="form-control" id="existing-project-name" />
      </div>
    </div>
    <h3 className="add-modal-section-header">Project Docroot</h3>
    <div className="section-description">
      Select the directory from which your site is served. You may skip this field if your site
      files are in the project root.
    </div>
    <div className="docroot-container add-site-segment">
      <div className="input-group select-docroot-folder">
        <span className="input-group-addon" id="basic-addon1">
          <i className="fa fa-folder-open-o" aria-hidden="true" />
        </span>
        <input
          type="text"
          id="existing-project-docroot"
          readOnly
          className="selected-docroot-text form-control"
          placeholder="Project Docroot Path"
          aria-describedby="basic-addon1"
        />
      </div>
    </div>
    <div className="btn btn-primary create-site-from-existing">Create Project</div>
  </div>
);

export default CreateExistingProjectForm;

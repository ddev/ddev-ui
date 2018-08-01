import React from "react";

const drupal7Img = require(__static + "/img/drupal7.png");
const drupal8Img = require(__static + "/img/drupal8.png");
const wordpressImg = require(__static + "/img/wordpress.png");

const CreateProjectForm = props => (
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
    <h3 className="add-modal-section-header">Application Type</h3>
    <div className="tile-container">
      <div className="tile">
        <img className="drupal7" src={drupal7Img} data-type="drupal7" />
      </div>
      <div className="tile">
        <img className="drupal8" src={drupal8Img} data-type="drupal8" />
      </div>
      <div className="tile">
        <img className="wordpress" src={wordpressImg} data-type="wordpress" />
      </div>
    </div>
    <h3 className="add-modal-section-header">Installation Directory</h3>
    <div className="select-folder-container add-site-segment">
      <div className="input-group select-path-folder">
        <span className="input-group-addon" id="basic-addon1">
          <i className="fa fa-folder-open-o" aria-hidden="true" />
        </span>
        <input
          type="text"
          readOnly
          className="selected-path-text form-control"
          placeholder="Path To Install Project"
          aria-describedby="basic-addon1"
        />
      </div>
    </div>
    <h3 className="add-modal-section-header">Project Name</h3>
    <div className="site-name-container add-site-segment">
      <div className="input-group">
        <input type="text" className="form-control" id="site-name" />
      </div>
    </div>
    <div className="hidden">
      <input type="hidden" id="appType" />
    </div>
    <div className="btn btn-primary create-site">Create Project</div>
  </div>
);

export default CreateProjectForm;

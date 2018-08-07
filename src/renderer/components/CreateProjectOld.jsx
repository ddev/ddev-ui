import React from 'react';

import CreateProjectForm from './CreateProjectForm';
import CreateExistingProjectForm from './CreateExistingProjectForm';

class CreateProjectOld extends React.Component {
  render() {
    return (
      <div className="create-project-old">
        <ul className="nav nav-tabs" id="createProjectForm" role="tablist">
          <li className="option-container column col-lg-6 col-md-6 col-sm-6 nav-item">
            <a
              className="nav-link"
              id="new-project-form-tab"
              data-toggle="tab"
              href="#new-project-form"
              role="tab"
              aria-controls="new-project-form"
              aria-selected="true"
            >
              <div className="btn btn-primary start-button-option-container">
                <i className="fa fa-file-archive-o" />
              </div>
              <div>Start fresh from a CMS template</div>
            </a>
          </li>
          <li className="option-container second-option column col-lg-6 col-md-6 col-sm-6 nav-item">
            <a
              className="nav-link"
              id="new-existing-project-tab"
              data-toggle="tab"
              href="#new-existing-project"
              role="tab"
              aria-controls="new-existing-project"
              aria-selected="false"
            >
              <div className="btn btn-primary start-button-option-container">
                <i className="fa fa-file-archive-o" />
              </div>
              <div>Start from existing project files</div>
            </a>
          </li>
        </ul>
        <div className="tab-content" id="createProjectFormContent">
          <div
            className="tab-pane fade"
            id="new-project-form"
            role="tabpanel"
            aria-labelledby="new-project-form-tab"
          >
            <CreateProjectForm />
          </div>
          <div
            className="tab-pane fade"
            id="new-existing-project"
            role="tabpanel"
            aria-labelledby="new-existing-project-tab"
          >
            <CreateExistingProjectForm />
          </div>
        </div>
      </div>
    );
  }
}

export default CreateProjectOld;

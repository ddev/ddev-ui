import React from 'react';

const AddProjectCard = () =>
  (
    <div className="column col-lg-3 col-md-4 col-sm-4">
      <div className="ddev-card card add">
        <div className="card-header">
          <h2><a href="#">Add/Create Project</a></h2>
        </div>
        <div className="card-body">
          <a href="#">
            <div className="add-site-icon" >
              <i className="fa fa-plus-circle" />
            </div>
          </a>
        </div>
        <div className="card-footer" />
      </div>
    </div>
  );

export default AddProjectCard;

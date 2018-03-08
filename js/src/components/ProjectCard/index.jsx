import React from 'react';
import PropTypes from 'prop-types';

const ProjectCard = ({ site }) =>
  (
    <div className={`column col-lg-3 col-md-4 col-sm-4 ${site.status}`} data-path={`${site.approot}`} data-sitename={`${site.name}`}>
      <div className="ddev-card card">
        <div className="card-header">
          <h2><a href="#" className="open-site" data-url={site.httpurl}>{site.name}</a></h2>
        </div>
        <div className="card-body">
          <a href="#" className="open-site" data-url={site.httpurl}>
            <div className="site-icon-container">
              <img className="site-icon" src={`img/${site.type}.png`} />
            </div>
            <div className="card-status">
              <div>{site.status}</div>
            </div>
          </a>
        </div>
        <div className="card-footer">
          <a className="btn btn-primary startbtn" href="#" role="button"><i className="fa fa-play" aria-hidden="true" /></a>
          <a className="btn btn-primary stopbtn" href="#" role="button"><i className="fa fa-stop" aria-hidden="true" /></a>
          <a className="btn btn-primary infobtn" href='#'><i className="fa fa-info" aria-hidden="true" /></a>
          <button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i className="fa fa-ellipsis-h" aria-hidden="true" />
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a className="dropdown-item restartbtn" href="#">Restart</a>
            <a className="dropdown-item removebtn" href="#" data-project-name={site.name} data-project-path={site.approot}>Remove Project</a>
            <a className="dropdown-item showfilesbtn" data-app-path={site.approot} href="#">Browse Local Files</a>
          </div>
        </div>
      </div>
    </div>
  );

ProjectCard.propTypes = {
  site: PropTypes.object.isRequired,
};

export default ProjectCard;

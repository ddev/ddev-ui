import React from "react";

class ProjectCard extends React.Component {
  render() {
    return (
      <div
        className={"column col-lg-3 col-md-4 col-sm-4 " + this.props.status}
        data-path={this.props.approot}
        data-sitename={this.props.name}
      >
        <div className="ddev-card card">
          <div className="card-header">
            <h2>
              <a href="#" className="open-site" data-url={this.props.httpurl}>
                {this.props.name}
              </a>
            </h2>
          </div>
          <div className="card-body">
            <a href="#" className="open-site" data-url={this.props.httpurl}>
              <div className="site-icon-container">
                <img
                  className="site-icon"
                  src={"img/" + this.props.type + ".png"}
                />
              </div>
              <div className="card-status">
                <div>{this.props.status}</div>
              </div>
            </a>
          </div>
          <div className="card-footer">
            <a className="btn btn-primary startbtn" href="#" role="button">
              <i className="fa fa-play" aria-hidden="true" />
            </a>
            <a className="btn btn-primary stopbtn" href="#" role="button">
              <i className="fa fa-stop" aria-hidden="true" />
            </a>
            <a className="btn btn-primary infobtn" href="#">
              <i className="fa fa-info" aria-hidden="true" />
            </a>
            <button
              className="btn btn-primary dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="fa fa-ellipsis-h" aria-hidden="true" />
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <a className="dropdown-item restartbtn" href="#">
                Restart
              </a>
              <a
                className="dropdown-item removebtn"
                href="#"
                data-project-name={this.props.name}
                data-project-path={this.props.approot}
              >
                Remove Project
              </a>
              <a
                className="dropdown-item showfilesbtn"
                data-app-path={this.props.approot}
                href="#"
              >
                Browse Local Files
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProjectCard;

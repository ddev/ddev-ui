import React from "react";

class ProjectHeader extends React.Component {
  renderIcon = status => {
    // set default color
    let color = "#00A079";

    // determine server color based on status
    switch (status) {
      case "running":
        color = "#00A079";
        break;
      case "stopped":
        color = "#EF5941";
        break;
      default:
        color = "#F3DD3E";
        break;
    }

    return (
      <svg
        width="17"
        height="15"
        xmlns="http://www.w3.org/2000/svg"
        className=""
      >
        <path
          d="M15.792 4.294H1.208A1.042 1.042 0 0 1 .167 3.253V1.169C.167.594.633.128 1.208.128h14.584c.575 0 1.041.466 1.041 1.041v2.084c0 .575-.466 1.041-1.041 1.041zM14.229 1.43a.781.781 0 1 0 0 1.562.781.781 0 0 0 0-1.562zm-2.083 0a.781.781 0 1 0 0 1.562.781.781 0 0 0 0-1.562zm3.646 8.073H1.208A1.042 1.042 0 0 1 .167 8.46V6.378c0-.576.466-1.042 1.041-1.042h14.584c.575 0 1.041.466 1.041 1.042V8.46c0 .575-.466 1.042-1.041 1.042zm-1.563-2.865a.781.781 0 1 0 0 1.563.781.781 0 0 0 0-1.563zm-2.083 0a.781.781 0 1 0 0 1.563.781.781 0 0 0 0-1.563zm3.646 8.073H1.208a1.042 1.042 0 0 1-1.041-1.042v-2.083c0-.575.466-1.042 1.041-1.042h14.584c.575 0 1.041.467 1.041 1.042v2.083c0 .576-.466 1.042-1.041 1.042zm-1.563-2.865a.781.781 0 1 0 0 1.563.781.781 0 0 0 0-1.563zm-2.083 0a.781.781 0 1 0 0 1.563.781.781 0 0 0 0-1.563z"
          fillRule="nonzero"
          fill={color}
        />
      </svg>
    );
  };
  render() {
    // project Icon
    let Icon;
    if (this.props.type !== undefined) {
      Icon = (
        <img
          alt="ddev logo"
          src={`/img/${this.props.type}.png`}
          className="platform-logo img-fluid"
        />
      );
    } else {
      Icon = null;
    }
    return (
      <header className="row align-items-center">
        <div className="project-info-wrapper col-sm-8">
          <div className="row align-items-center section-box">
            <div className="col-3 text-center p-0">{Icon}</div>
            <div className="project-info col-9 p-0">
              <h1 className="text-dark mb-1">
                {this.props.name}
                <span className="ml-2">
                  {this.renderIcon(this.props.status)}
                </span>
              </h1>
              <p className="project-path text-secondary mb-1">
                <a href="#!" className="text-secondary">
                  <i className="fa fa-folder-open-o" />
                  <span className="mx-2">{this.props.shortroot}</span>
                  <i className="fa fa-eye" />
                </a>
              </p>
              <ul className="project-actions list-unstyled list-inline mb-0">
                <li className="restart list-inline-item">
                  <a href="#!" className="text-success">
                    <i className="fa fa-retweet" aria-hidden="true" /> Restart
                  </a>
                </li>
                <li className="stop list-inline-item">
                  <a href="#!" className="text-danger">
                    <i className="fa fa-stop-circle-o" aria-hidden="true" />{" "}
                    Stop
                  </a>
                </li>
                <li className="remove list-inline-item">
                  <a href="#!" className="text-danger">
                    <i className="fa fa-trash-o" aria-hidden="true" /> Remove
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="project-buttons col-sm-4">
          <div className="btn-group" role="group" aria-label="View Site">
            <button type="button" className="btn btn-secondary">
              View Site
            </button>
            <button type="button" className="btn btn-secondary">
              Site Admin
            </button>
          </div>
        </div>
      </header>
    );
  }
}

export default ProjectHeader;

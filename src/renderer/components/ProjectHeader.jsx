import React from "react";

const ddevShell = require("./../modules/ddev-shell");
const electron = require("electron");

// project type Icon
const ProjectTypeIcon = props => {
  const { type, httpurl } = props;
  if (type) {
    return (
      <a
        href="#!"
        className="open-site"
        onClick={e => {
          e.preventDefault();
          electron.shell.openExternal(httpurl);
        }}
      >
        <img
          alt="ddev logo"
          src={`/img/${type}.png`}
          className="platform-logo img-fluid"
        />
      </a>
    );
  } else {
    return null;
  }
};

// project status Icon
const ProjectStatusIcon = props => {
  const { status } = props;
  // set default color
  let color = null;

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
    <svg width="17" height="15" xmlns="http://www.w3.org/2000/svg" className="">
      <path
        d="M15.792 4.294H1.208A1.042 1.042 0 0 1 .167 3.253V1.169C.167.594.633.128 1.208.128h14.584c.575 0 1.041.466 1.041 1.041v2.084c0 .575-.466 1.041-1.041 1.041zM14.229 1.43a.781.781 0 1 0 0 1.562.781.781 0 0 0 0-1.562zm-2.083 0a.781.781 0 1 0 0 1.562.781.781 0 0 0 0-1.562zm3.646 8.073H1.208A1.042 1.042 0 0 1 .167 8.46V6.378c0-.576.466-1.042 1.041-1.042h14.584c.575 0 1.041.466 1.041 1.042V8.46c0 .575-.466 1.042-1.041 1.042zm-1.563-2.865a.781.781 0 1 0 0 1.563.781.781 0 0 0 0-1.563zm-2.083 0a.781.781 0 1 0 0 1.563.781.781 0 0 0 0-1.563zm3.646 8.073H1.208a1.042 1.042 0 0 1-1.041-1.042v-2.083c0-.575.466-1.042 1.041-1.042h14.584c.575 0 1.041.467 1.041 1.042v2.083c0 .576-.466 1.042-1.041 1.042zm-1.563-2.865a.781.781 0 1 0 0 1.563.781.781 0 0 0 0-1.563zm-2.083 0a.781.781 0 1 0 0 1.563.781.781 0 0 0 0-1.563z"
        fillRule="nonzero"
        fill={color}
      />
    </svg>
  );
};

class ProjectHeader extends React.Component {
  processStart = e => {
    e.preventDefault();
    console.log("starting");
    ddevShell.start(
      this.props.approot,
      data => {
        console.log(data);
      },
      error => {
        console.log(error);
      }
    );
  };
  processRestart = e => {
    e.preventDefault();
    console.log("restarting");
    ddevShell.restart(
      this.props.approot,
      data => {
        console.log(data);
      },
      error => {
        console.log(error);
      }
    );
  };
  processStop = e => {
    e.preventDefault();
    console.log("stopping");
    ddevShell.stop(
      this.props.approot,
      data => {
        console.log(data);
      },
      error => {
        console.log(error);
      }
    );
  };
  processRemove = e => {
    e.preventDefault();
    console.log("stopping");
    ddevShell.remove(
      this.props.name,
      false, // TODO: Need to remove
      data => {
        console.log(data);
      },
      error => {
        console.log(error);
      }
    );
  };
  render() {
    return (
      <header className="row align-items-center">
        <div className="project-info-wrapper col-sm-8">
          <div className="row align-items-center section-box">
            <div className="col-3 text-center p-0">
              <ProjectTypeIcon {...this.props} />
            </div>
            <div className="project-info col-9 p-0">
              <h1 className="mb-1">
                <a
                  href="#!"
                  className="open-site"
                  onClick={e => {
                    e.preventDefault();
                    electron.shell.openExternal(this.props.httpurl);
                  }}
                >
                  {this.props.name}
                  <span className="ml-2">
                    <ProjectStatusIcon {...this.props} />
                  </span>
                </a>
              </h1>
              <p className="project-path text-secondary mb-1">
                <a
                  href="#!"
                  className="text-secondary"
                  onClick={e => {
                    e.preventDefault();
                    electron.shell.showItemInFolder(this.props.approot);
                  }}
                >
                  <i className="fa fa-folder-open-o" />
                  <span className="mx-2">{this.props.shortroot}</span>
                  <i className="fa fa-eye" />
                </a>
              </p>
              <ul className="project-actions list-unstyled list-inline mb-0">
                {this.props.status === "stopped" ? (
                  <li className="restart list-inline-item">
                    <a
                      href="#!"
                      className="text-success"
                      onClick={this.processStart}
                    >
                      <i className="fa fa-retweet" aria-hidden="true" /> Start
                    </a>
                  </li>
                ) : (
                  <li className="restart list-inline-item">
                    <a
                      href="#!"
                      className="text-success"
                      onClick={this.processRestart}
                    >
                      <i className="fa fa-retweet" aria-hidden="true" /> Restart
                    </a>
                  </li>
                )}
                {this.props.status !== "stopped" ? (
                  <li className="stop list-inline-item">
                    <a
                      href="#!"
                      className="text-danger"
                      onClick={this.processStop}
                    >
                      <i className="fa fa-stop-circle-o" aria-hidden="true" />{" "}
                      Stop
                    </a>
                  </li>
                ) : null}
                <li className="remove list-inline-item">
                  <a
                    href="#!"
                    className="text-danger"
                    onClick={this.processRemove}
                  >
                    <i className="fa fa-trash-o" aria-hidden="true" /> Remove
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="project-buttons col-sm-4">
          <div className="btn-group" role="group" aria-label="View Site">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={e => {
                e.preventDefault();
                electron.shell.openExternal(this.props.httpurl);
              }}
            >
              View Site
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={e => {
                e.preventDefault();
                electron.shell.openExternal(this.props.httpurl);
              }}
            >
              Site Admin
            </button>
          </div>
        </div>
      </header>
    );
  }
}

export default ProjectHeader;

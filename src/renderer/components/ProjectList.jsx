import React from "react";
import { NavLink } from "react-router-dom";
import electron from "electron";

import ddevShell from "./../modules/ddev-shell";

import ReactDataGrid from "react-data-grid";
import ProjectStatusIcon from "./ProjectStatusIcon";

class ProjectList extends React.PureComponent {
  state = {
    rows: []
  };
  createRows = () => {
    let rows = [];
    if (this.props.projects) {
      Object.keys(this.props.projects).map(projectKey => {
        const project = this.props.projects[projectKey];
        let platformIcon = project.type;
        switch (project.type) {
          case "drupal8":
          case "drupal7":
            platformIcon = "drupal";
            break;

          default:
            break;
        }
        let color = "text-warning";
        switch (project.status) {
          case "running":
            color = "text-success";
            break;
          case "stopped":
            color = "text-danger";
            break;
          default:
            break;
        }
        rows.push({
          id: (
            <NavLink to={`/project/${project.name}/`}>
              <i
                className={`fa fa-${platformIcon} fa-2 mr-2`}
                aria-hidden="true"
              />{" "}
              {project.name}
            </NavLink>
          ),
          actions: (
            <div
              className="actions"
              data-path={project.approot}
              data-sitename={project.name}
            >
              {/* Browse Files */}
              <a
                className="mx-1 text-secondary"
                data-app-path={project.approot}
                onClick={e => {
                  e.preventDefault();
                  electron.shell.showItemInFolder(project.approot);
                }}
                href="#!"
              >
                <i className="fa fa-folder-open-o" aria-hidden="true" />
              </a>
              {/* View */}
              <a
                className="mx-1 text-secondary"
                data-url={project.httpurl}
                onClick={e => {
                  e.preventDefault();
                  electron.shell.openExternal(project.httpurl);
                }}
                href="#!"
              >
                <i className="fa fa-eye" aria-hidden="true" />
              </a>
              {/* Start */}
              {project.status === "stopped" && (
                <a
                  className="mx-1 text-secondary"
                  onClick={this.processStart}
                  href="#!"
                >
                  <i className="fa fa-play-circle" aria-hidden="true" />
                </a>
              )}
              {/* Restart */}
              {project.status !== "stopped" && (
                <a
                  className="mx-1 text-secondary"
                  onClick={this.processRestart}
                  href="#!"
                >
                  <i className="fa fa-retweet" aria-hidden="true" />
                </a>
              )}
              {/* Stop */}
              <a
                className="mx-1 text-secondary"
                onClick={this.processStop}
                href="#!"
              >
                <i className="fa fa-stop-circle-o" aria-hidden="true" />
              </a>
              {/* Remove */}
              <a
                className="mx-1 text-danger"
                onClick={this.processRemove}
                href="#!"
              >
                <i className="fa fa-trash-o" aria-hidden="true" />
              </a>
            </div>
          ),
          status: <ProjectStatusIcon {...project} />
        });
      });
    }
    return rows;
  };
  rowGetter = i => {
    return this.state.rows[i];
  };
  componentDidMount() {
    const rows = this.createRows();
    this.setState({ rows: rows });
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.projects !== prevProps.projects) {
      let rows = this.createRows();
      this.setState({ rows: rows });
    }
  }
  processStart = e => {
    e.preventDefault();
    console.log("starting");
    ddevShell.start(
      $(e.target)
        .closest(".actions")
        .data("path"),
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
      $(e.target)
        .closest(".actions")
        .data("path"),
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
      $(e.target)
        .closest(".actions")
        .data("path"),
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
    console.log("removing");
    ddevShell.remove(
      $(e.target)
        .closest(".actions")
        .data("sitename"),
      false,
      data => {
        // TODO: Need to remove
        console.log(data);
      },
      error => {
        console.log(error);
      }
    );
  };
  render() {
    return (
      <section className="container">
        <main>
          <h1>My Projects</h1>
          <div className="row card-container">
            {this.state.rows &&
              this.state.rows.length !== 0 && (
                <ReactDataGrid
                  columns={[
                    { key: "id", name: "ID", cellClass: "" },
                    {
                      key: "actions",
                      name: "Actions",
                      cellClass: "text-center",
                      width: 150
                    },
                    {
                      key: "status",
                      name: "Status",
                      cellClass: "text-center",
                      width: 80
                    }
                  ]}
                  rowGetter={this.rowGetter}
                  rowsCount={this.state.rows.length}
                  rowHeight={55}
                  minHeight={500}
                />
              )}
          </div>
        </main>
      </section>
    );
  }
}

export default ProjectList;

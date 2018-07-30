import React from "react";
import ProjectCard from "./ProjectCard";
import { NavLink } from "react-router-dom";

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
            <NavLink to={`/project/${project.name}/`}><i className={`fa fa-${platformIcon} fa-2 mr-2`} aria-hidden="true" /> {project.name}</NavLink>
          ),
          actions: (
            <div className="actions">
              {/* Browse Files */}
              <a className="mx-1 text-secondary" href="">
                <i className="fa fa-folder-open-o" aria-hidden="true" />
              </a>
              {/* View */}
              <a className="mx-1 text-secondary" href="">
                <i className="fa fa-eye" aria-hidden="true" />
              </a>
              {/* Start */}
              <a className="mx-1 text-secondary" href="">
                <i className="fa fa-play-circle" aria-hidden="true" />
              </a>
              {/* Restart */}
              <a className="mx-1 text-secondary" href="">
                <i className="fa fa-retweet" aria-hidden="true" />
              </a>
              {/* Stop */}
              <a className="mx-1 text-secondary" href="">
                <i className="fa fa-stop-circle-o" aria-hidden="true" />
              </a>
              {/* Remove */}
              <a className="mx-1 text-danger" href="">
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
                  { key: "actions", name: "Actions", cellClass: "text-center", width: 150 },
                  { key: "status", name: "Status", cellClass: "text-center", width: 80 }
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

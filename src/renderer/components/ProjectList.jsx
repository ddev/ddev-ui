import React from 'react';
import { NavLink } from 'react-router-dom';
import electron from 'electron';

import ReactDataGrid from 'react-data-grid';
import { start, restart, stop, remove } from '../modules/ddev-shell';

import ProjectStatusIcon from './ProjectStatusIcon';

class ProjectList extends React.PureComponent {
  state = {
    rows: [],
  };

  componentDidMount() {
    const rows = this.createRows();
    this.setState({ rows });
  }

  componentDidUpdate(prevProps) {
    if (this.props.projects !== prevProps.projects) {
      const rows = this.createRows();
      this.setState({ rows });
    }
  }

  createRows = () => {
    const rows = [];
    if (this.props.projects) {
      Object.keys(this.props.projects).forEach(projectKey => {
        const project = this.props.projects[projectKey];
        let platformIcon = project.type;
        switch (project.type) {
          case 'drupal6':
          case 'drupal8':
          case 'drupal7':
            platformIcon = 'drupal';
            break;

          case 'wordpress':
            platformIcon = 'wordpress';
            break;

          case 'typo3':
          case 'backdrop':
          case 'php':
          default:
            platformIcon = 'code';
            break;
        }
        rows.push({
          id: (
            <NavLink to={`/project/${project.name}/`}>
              <i className={`fa fa-${platformIcon} fa-2 mr-2`} aria-hidden="true" /> {project.name}
            </NavLink>
          ),
          actions: (
            <div className="actions" data-path={project.approot} data-sitename={project.name}>
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
              {project.status === 'stopped' && (
                <a className="mx-1 text-secondary" onClick={this.processStart} href="#!">
                  <i className="fa fa-play-circle" aria-hidden="true" />
                </a>
              )}
              {/* Restart */}
              {project.status !== 'stopped' && (
                <a className="mx-1 text-secondary" onClick={this.processRestart} href="#!">
                  <i className="fa fa-retweet" aria-hidden="true" />
                </a>
              )}
              {/* Stop */}
              <a className="mx-1 text-secondary" onClick={this.processStop} href="#!">
                <i className="fa fa-stop-circle-o" aria-hidden="true" />
              </a>
              {/* Remove */}
              <a className="mx-1 text-danger" onClick={this.processRemove} href="#!">
                <i className="fa fa-trash-o" aria-hidden="true" />
              </a>
            </div>
          ),
          status: <ProjectStatusIcon {...project} />,
        });
      });
    }
    return rows;
  };

  rowGetter = i => this.state.rows[i];

  processStart = e => {
    e.preventDefault();
    console.log('starting');
    start(
      $(e.target)
        .closest('.actions')
        .data('path'),
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
    console.log('restarting');
    restart(
      $(e.target)
        .closest('.actions')
        .data('path'),
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
    console.log('stopping');
    stop(
      $(e.target)
        .closest('.actions')
        .data('path'),
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
    console.log('removing');
    remove(
      $(e.target)
        .closest('.actions')
        .data('sitename'),
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
      <section className="my-projects">
        <h1>My Projects</h1>
        <div className="project-grid">
          {this.state.rows &&
            this.state.rows.length !== 0 && (
              <ReactDataGrid
                columns={[
                  { key: 'id', name: 'ID', cellClass: '' },
                  {
                    key: 'actions',
                    name: 'Actions',
                    cellClass: 'text-center',
                    width: 150,
                  },
                  {
                    key: 'status',
                    name: 'Status',
                    cellClass: 'text-center',
                    width: 80,
                  },
                ]}
                rowGetter={this.rowGetter}
                rowsCount={this.state.rows.length}
                rowHeight={55}
                minHeight={500}
              />
            )}
        </div>
      </section>
    );
  }
}

export default ProjectList;

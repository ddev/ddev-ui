import React from 'react';
import electron from 'electron';
import fetch from 'node-fetch';

import ProjectTypeIcon from './ProjectTypeIcon';
import ProjectStatusIcon from './ProjectStatusIcon';

import { showLoadingScreen, showErrorScreen } from '../modules/helpers';
import { start, restart, stop, remove } from '../modules/ddev-shell';

class ProjectHeader extends React.PureComponent {
  processStart = e => {
    e.preventDefault();
    console.log('starting');
    showLoadingScreen(true, 'Starting Project');
    start(
      this.props.approot,
      data => {
        const res = data.toString();
        if (res.includes('Process Exited')) {
          showLoadingScreen(false);
        } else {
          showLoadingScreen(true, res);
        }
      },
      err => {
        console.error(err);
        showErrorScreen(true, err.toString());
      }
    );
  };

  processRestart = e => {
    e.preventDefault();
    console.log('restarting');
    showLoadingScreen(true, 'Restarting Project');
    restart(
      this.props.approot,
      data => {
        const res = data.toString();
        if (res.includes('Process Exited')) {
          showLoadingScreen(false);
        } else {
          showLoadingScreen(true, res);
        }
      },
      err => {
        console.error(err);
        showErrorScreen(true, err.toString());
      }
    );
  };

  processStop = e => {
    e.preventDefault();
    console.log('stopping');
    showLoadingScreen(true, 'Stopping Project');
    stop(
      this.props.approot,
      data => {
        const res = data.toString();
        if (res.includes('Process Exited')) {
          showLoadingScreen(false);
        } else {
          showLoadingScreen(true, res);
        }
      },
      err => {
        console.error(err);
        showErrorScreen(true, err.toString());
      }
    );
  };

  processRemove = e => {
    e.preventDefault();
    console.log('stopping');
    showLoadingScreen(true, 'Removing Project');
    remove(
      this.props.name,
      false, // TODO: Need to remove
      data => {
        const res = data.toString();
        if (res.includes('Process Exited')) {
          showLoadingScreen(false);
          this.props.push('/');
        } else {
          showLoadingScreen(true, res);
        }
      },
      err => {
        console.error(err);
        showErrorScreen(true, err.toString());
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
                    fetch(this.props.httpurl).then(res => {
                      if (res.statusText.includes('Service unavailable')) {
                        return electron.shell.openExternal(`${this.props.httpurl}/install.php`);
                      }
                      return electron.shell.openExternal(this.props.httpurl);
                    });
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
                {this.props.status === 'stopped' ? (
                  <li className="restart list-inline-item">
                    <a href="#!" className="text-success" onClick={this.processStart}>
                      <i className="fa fa-retweet" aria-hidden="true" /> Start
                    </a>
                  </li>
                ) : (
                  <li className="restart list-inline-item">
                    <a href="#!" className="text-success" onClick={this.processRestart}>
                      <i className="fa fa-retweet" aria-hidden="true" /> Restart
                    </a>
                  </li>
                )}
                {this.props.status !== 'stopped' ? (
                  <li className="stop list-inline-item">
                    <a href="#!" className="text-danger" onClick={this.processStop}>
                      <i className="fa fa-stop-circle-o" aria-hidden="true" /> Stop
                    </a>
                  </li>
                ) : null}
                <li className="remove list-inline-item">
                  <a href="#!" className="text-danger" onClick={this.processRemove}>
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
              className="btn btn-outline-secondary"
              onClick={e => {
                e.preventDefault();
                fetch(this.props.httpurl).then(res => {
                  if (res.statusText.includes('Service unavailable')) {
                    return electron.shell.openExternal(`${this.props.httpurl}/install.php`);
                  }
                  return electron.shell.openExternal(this.props.httpurl);
                });
              }}
            >
              View Site
            </button>
            {/* <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={e => {
                e.preventDefault();
                electron.shell.openExternal(this.props.phpmyadmin_url);
              }}
            >
              phpMyAdmin
            </button> */}
          </div>
        </div>
      </header>
    );
  }
}

export default ProjectHeader;

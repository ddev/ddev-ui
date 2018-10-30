import React from 'react';
import electron from 'electron';

import { showLoadingScreen, showErrorScreen } from 'helpers';
import { start, restart, stop, remove } from 'ddev-shell';

class ProjectActions extends React.PureComponent {
  processStart = e => {
    e.preventDefault();
    console.log('starting');
    showLoadingScreen(true, 'Starting Project');
    start(
      $(e.target)
        .closest('.actions')
        .data('path'),
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
      $(e.target)
        .closest('.actions')
        .data('path'),
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
      $(e.target)
        .closest('.actions')
        .data('path'),
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
    console.log('removing');
    showLoadingScreen(true, 'Removing Project');
    remove(
      $(e.target)
        .closest('.actions')
        .data('sitename'),
      false,
      data => {
        const res = data.toString();
        if (res.includes('Process Exited')) {
          showLoadingScreen(false);
          this.props.history.push('/');
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
      <div className="actions" data-path={this.props.approot} data-sitename={this.props.name}>
        {/* Browse Files */}
        <a
          title="Browse Files"
          className="mx-1 text-secondary"
          data-app-path={this.props.approot}
          onClick={e => {
            e.preventDefault();
            electron.shell.showItemInFolder(this.props.approot);
          }}
          href="#!"
        >
          <i className="fa fa-folder-open-o" aria-hidden="true" />
        </a>
        {/* View */}
        <a
          title="View"
          className="mx-1 text-secondary"
          data-url={this.props.httpurl}
          onClick={e => {
            e.preventDefault();
            electron.shell.openExternal(this.props.httpurl);
          }}
          href="#!"
        >
          <i className="fa fa-eye" aria-hidden="true" />
        </a>
        {/* Start */}
        {this.props.status === 'stopped' && (
          <a title="Start" className="mx-1 text-secondary" onClick={this.processStart} href="#!">
            <i className="fa fa-play-circle" aria-hidden="true" />
          </a>
        )}
        {/* Restart */}
        {this.props.status !== 'stopped' && (
          <a
            title="Restart"
            className="mx-1 text-secondary"
            onClick={this.processRestart}
            href="#!"
          >
            <i className="fa fa-retweet" aria-hidden="true" />
          </a>
        )}
        {/* Stop */}
        <a title="Stop" className="mx-1 text-secondary" onClick={this.processStop} href="#!">
          <i className="fa fa-stop-circle-o" aria-hidden="true" />
        </a>
        {/* Remove */}
        <a title="Remove" className="mx-1 text-danger" onClick={this.processRemove} href="#!">
          <i className="fa fa-trash-o" aria-hidden="true" />
        </a>
      </div>
    );
  }
}

export default ProjectActions;

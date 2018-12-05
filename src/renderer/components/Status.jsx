import React from 'react';

class Status extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        <div className="loading-overlay flex-column h-100 w-100">
          <div>
            <i className="fa fa-spinner fa-spin loading-spinner" />
          </div>
          <div className="loading-text">Working...</div>
        </div>
        <div className="error-overlay flex-column h-100 w-100">
          <div>
            <i className="fa fa-exclamation-triangle error-icon" />
          </div>
          <div className="error-text">Something Went Wrong</div>
          <div className="btn btn-primary">OK</div>
        </div>
      </React.Fragment>
    );
  }
}

export default Status;

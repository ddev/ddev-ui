import React from 'react';

import ProjectHeader from './ProjectHeader';
import ProjectInfo from './ProjectInfo';

class ProjectDetail extends React.PureComponent {
  render() {
    return (
      <section className="project-info">
        {this.props.project ? (
          <div className="project-details">
            <div className="loading-overlay">
              <div>
                <i className="fa fa-spinner fa-spin loading-spinner" />
              </div>
              <div className="loading-text">Working...</div>
            </div>
            <div className="error-overlay">
              <div>
                <i className="fa fa-exclamation-triangle error-icon" />
              </div>
              <div className="error-text">Something Went Wrong</div>
              <div className="btn btn-primary">OK</div>
            </div>
            <ProjectHeader {...this.props.project} />
            <ProjectInfo {...this.props.project} />
          </div>
        ) : null}
      </section>
    );
  }
}

export default ProjectDetail;

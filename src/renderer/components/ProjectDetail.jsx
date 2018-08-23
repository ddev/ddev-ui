import React from 'react';

import ProjectHeader from './ProjectHeader';
import ProjectInfo from './ProjectInfo';
import Status from './Status';

class ProjectDetail extends React.PureComponent {
  render() {
    return (
      <section className="project-info">
        {this.props.project ? (
          <div className="project-details">
            <Status />
            <ProjectHeader {...this.props.project} />
            <ProjectInfo {...this.props.project} />
          </div>
        ) : (
          <h1 className="text-center text-danger">Project Was Not Found!</h1>
        )}
      </section>
    );
  }
}

export default ProjectDetail;

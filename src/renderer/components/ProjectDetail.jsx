import React from 'react';

import ProjectHeader from './ProjectHeader';
import ProjectInfo from './ProjectInfo';
import Status from './Status';

class ProjectDetail extends React.PureComponent {
  render() {
    return (
      <section className="project-info">
        <Status />
        {this.props.project && (
          <div className="project-details">
            <ProjectHeader {...this.props.project} />
            <ProjectInfo {...this.props.project} />
          </div>
        )}
      </section>
    );
  }
}

export default ProjectDetail;

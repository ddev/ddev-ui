import React from 'react';

import ProjectHeader from './ProjectHeader';
import ProjectInfo from './ProjectInfo';

class ProjectDetail extends React.PureComponent {
  render() {
    return (
      <section className="project-info">
        {this.props.project ? (
          <div className="project-details">
            <ProjectHeader {...this.props.project} />
            <ProjectInfo {...this.props.project} />
          </div>
        ) : null}
      </section>
    );
  }
}

export default ProjectDetail;

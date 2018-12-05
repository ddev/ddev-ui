import React from 'react';

import ProjectHeader from 'Components/ProjectHeader';
import ProjectInfo from 'Components/ProjectInfo';

class ProjectDetail extends React.PureComponent {
  render() {
    return (
      <section className="project-info w-100">
        {this.props.project && (
          <div className="project-details">
            <ProjectHeader {...this.props.project} {...this.props.history} />
            <ProjectInfo {...this.props.project} />
          </div>
        )}
      </section>
    );
  }
}

export default ProjectDetail;

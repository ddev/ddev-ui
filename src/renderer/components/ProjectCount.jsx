import React from 'react';
import _ from 'lodash';

class ProjectCount extends React.Component {
  render() {
    const { projects } = this.props;
    const projectCount = Object.keys(projects).length;
    let activeProjectCount = 0;

    if (projectCount > 0) {
      const activeProjects = _.filter(projects, { status: 'running' });
      activeProjectCount = activeProjects.length;
    }

    return (
      <div className={`project-count ${this.props.className ? this.props.className : ''}`}>
        <p className="m-0 text-center">
          <b>{projectCount}</b> Projects, <b>{activeProjectCount}</b> Active
        </p>
      </div>
    );
  }
}

export default ProjectCount;

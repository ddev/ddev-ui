import React from 'react';

class ProjectCount extends React.Component {
  render() {
    return (
      <div className={`project-count ${this.props.className ? this.props.className : ''}`}>
        <p className="m-0 text-center">
          <b>3</b> Projects, <b>1</b> Active
        </p>
      </div>
    );
  }
}

export default ProjectCount;

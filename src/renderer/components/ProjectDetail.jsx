import React from "react";
import ProjectHeader from "./ProjectHeader";
import ProjectInfo from "./ProjectInfo";
import ddevShell from "../modules/ddev-shell";

class ProjectDetail extends React.Component {
  state = {
    project: {}
  };
  componentDidMount() {
    console.log(this.props);
    const { params } = this.props.match;
    this.fetchProject(params.projectID);
    // TODO: this could be reduced/removed once state is updated everywhere.
    this.timerID = setInterval(() => this.heartBeat(), 1000);
  }
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  heartBeat = () => {
    this.fetchProject(this.props.match.params.projectID);
  };
  fetchProject = newProject => {
    ddevShell
      .describe(newProject)
      .then(newProject => {
        // 1. Take a copy of the existing state
        let project = { ...this.state.project };
        // 2. Add our new projects to that projects variable
        // console.log(newProject);
        project = newProject;
        // 3. Set the new projects object to state
        this.setState({ project });
      })
      .catch(e => {
        // console.log(e);
        this.props.addError(e);
      });
  };
  render() {
    return (
      <section className="project-info">
        {this.state.project.name ? (
          <div className="project-details">
            <ProjectHeader {...this.state.project} />
            <ProjectInfo {...this.state.project} />
          </div>
        ) : null}
      </section>
    );
  }
}

export default ProjectDetail;

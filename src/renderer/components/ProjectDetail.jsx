import React from "react";
import ProjectHeader from "./ProjectHeader";
import ProjectInfo from "./ProjectInfo";
const ddevShell = require("../modules/ddev-shell");

class ProjectDetail extends React.Component {
  state = {
    project: {}
  };
  constructor(props) {
    super(props);
    const { params } = props.match;
    this.fetchProject(params.projectID);
  }
  componentDidUpdate(prevProps) {
    const { params } = this.props.match;
    if (params.projectID !== prevProps.match.params.projectID) {
      this.fetchProject(params.projectID);
    }
  }
  componentDidMount() {
    console.log(this.props);
    // TODO: this could be reduced/removed once state is updated everywhere.
    this.timerID = setInterval(() => this.heartBeat(), 5000);
  }
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  heartBeat = () => {
    this.fetchProject(this.props.match.params.projectID);
  };
  fetchProject = async newProject => {
    await ddevShell
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

import React from "react";

import ProjectCard from "./ProjectCard";
class ProjectList extends React.Component {
  render() {
    {
      console.log(this.props.projects);
    }
    return (
      <section className="Content container">
        <main className="">
          <h1>My Projects</h1>
          <div className="row card-container">
            {Object.keys(this.props.projects).map(key => (
              <ProjectCard key={key} {...this.props.projects[key]} />
            ))}
          </div>
        </main>
      </section>
    );
  }
}

export default ProjectList;

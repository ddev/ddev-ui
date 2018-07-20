import React from "react";
import { NavLink } from "react-router-dom";

class ProjectDetail extends React.Component {
  render() {
    return (
      <section className="Main">
        <NavLink to="/app">Project Detail</NavLink>
      </section>
    );
  }
}

export default ProjectDetail;
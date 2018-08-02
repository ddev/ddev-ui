import React, { Component } from "react";
import { ListViewRow, Text } from "react-desktop/macOs";
import { NavLink } from "react-router-dom";

import ProjectStatusIcon from "./ProjectStatusIcon";

class ProjectNavItem extends React.Component {
  render() {
    const navLinkHref = `/project/${this.props.name}/`;
    return (
      <ListViewRow
        height="43"
        margin="0px"
        padding="0px"
        verticalAlignment="center"
        className="ListViewRow"
      >
        <NavLink
          className="w-100 h-100"
          to={navLinkHref}
          data-sitename={this.props.name}
        >
          <div
            className="align-items-center d-flex flex-row h-100 w-100"
            data-sitename={this.props.name}
          >
            <ProjectStatusIcon
              className="project-status-icon ml-2"
              status={this.props.status}
            />
            <span className="pl-3">
              <h3>{this.props.name}</h3>
              <p>{this.props.status}</p>
            </span>
          </div>
        </NavLink>
      </ListViewRow>
    );
  }
}

export default ProjectNavItem;

import React, { Component } from "react";
import { ListViewRow, Text } from "react-desktop/macOs";
import { NavLink } from "react-router-dom";

import ProjectStatusIcon from "./ProjectStatusIcon";

class ProjectNavItem extends React.Component {
  render() {
    const navLinkHref = `/project/${this.props.name}/`;
    return (
      <ListViewRow
        height="40"
        padding="5px 10px"
        verticalAlignment="center"
        className="ListViewRow"
      >
        <Text
          className="column w-100 pl-3 my-2"
          data-sitename={this.props.name}
        >
          <NavLink
            className="align-items-center d-flex flex-row w-100"
            to={navLinkHref}
          >
            <ProjectStatusIcon status={this.props.status} />
            <span className="pl-3">
              <h3>{this.props.name}</h3>
              <p>{this.props.status}</p>
            </span>
          </NavLink>
        </Text>
      </ListViewRow>
    );
  }
}

export default ProjectNavItem;

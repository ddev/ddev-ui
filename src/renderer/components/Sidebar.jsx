import React, { Component } from "react";
import {
  ListView,
  ListViewHeader,
  ListViewFooter,
  ListViewSection,
  ListViewRow,
  Text
} from "react-desktop/macOs";
import { NavLink } from "react-router-dom";

import ProjectNavItem from "./ProjectNavItem";

const stack = require(__static + "/img/stack.svg");

class Sidebar extends React.Component {
  render() {
    return (
      <ListView className="projectSidebar h-md-100 col-md-4 p-0">
        <ListViewHeader
          padding="0.8rem 1rem 0.8rem 1rem"
          className="ListViewHeader align-items-center d-flex flex-row w-100"
        >
          <img alt="DDEV UI" src={stack} className="" />
          <h1 className="pl-2 mb-0">Projects</h1>
          <div className="add ListViewHeaderAdd ml-auto">
            <NavLink
              className="btn btn-outline-primary btn-sm"
              to="/project/create"
            >
              + New
            </NavLink>
          </div>
        </ListViewHeader>
        {this.props.projects && (
          <ListViewSection className="ListViewSection">
            {Object.keys(this.props.projects).map(key => (
              <ProjectNavItem
                key={key}
                index={key}
                {...this.props.projects[key]}
              />
            ))}
          </ListViewSection>
        )}
        <ListViewFooter className="ListViewFooter">
          <Text>Status</Text>
        </ListViewFooter>
      </ListView>
    );
  }
}

export default Sidebar;

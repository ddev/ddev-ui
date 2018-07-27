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

class Sidebar extends React.Component {
  render() {
    return (
      <ListView className="projectSidebar">
        <ListViewHeader
          height="80px"
          className="ListViewHeader align-items-center d-flex flex-row w-100"
        >
          <svg
            width="20"
            height="18"
            xmlns="http://www.w3.org/2000/svg"
            className="ListViewHeaderIcon"
          >
            <path
              d="M15 7.402V3.004c0-.586-.363-1.11-.914-1.317L10.492.34a1.39 1.39 0 0 0-.988 0L5.91 1.687c-.55.208-.914.731-.914 1.317v4.398L.914 8.937C.364 9.142 0 9.668 0 10.255v4.164c0 .531.3 1.02.777 1.258l3.852 1.926c.394.199.863.199 1.258 0L10 15.547l4.113 2.055c.395.199.864.199 1.258 0l3.852-1.926c.476-.239.777-.727.777-1.258v-4.164c0-.586-.363-1.11-.914-1.316L15 7.402zm-4.531 1.36V4.937L14.063 3.7v3.813l-3.594 1.25zM5.938 2.68L10 1.156l4.063 1.524v.007L10 4.117 5.937 2.684V2.68zm0 1.02L9.53 4.936v3.825l-3.594-1.25V3.699zM4.766 16.565l-3.782-1.89V11.03l3.782 1.535v4zM.984 9.97V9.96l4.274-1.602L9.48 9.941v.047l-4.222 1.715L.984 9.97zm4.766 2.597l3.73-1.515v3.652L5.75 16.57v-4.004zm8.5 4l-3.73-1.863v-3.648l3.73 1.515v3.996zm4.766-1.89l-3.782 1.89v-4l3.782-1.535v3.645zm0-4.707l-4.274 1.734-4.222-1.715v-.047l4.222-1.582 4.274 1.602v.008z"
              fillRule="nonzero"
              fill="#236192"
            />
          </svg>
          <h1 className="pl-3 mb-0">
            <NavLink to="/projects">Projects</NavLink>
          </h1>
          <div className="add ListViewHeaderAdd ml-auto">
            <a className="btn btn-primary btn-sm" href="#">
              + New
            </a>
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

import React, { Component } from "react";
import {
  ListView,
  ListViewHeader,
  ListViewFooter,
  ListViewSection,
  ListViewRow,
  Text
} from "react-desktop/macOs";

import ProjectItem from "./ProjectItem";

class Sidebar extends React.Component {
  constructor() {
    super();
    this.state = { selected: null };
  }
  renderIcon(status) {
    // set default color
    let color = "#00A079";

    // determine server color based on status
    switch (status) {
      case "running":
        color = "#00A079";
        break;
      case "stopped":
        color = "#00A079";
        break;
      default:
        break;
    }

    return (
      <svg width="17" height="15" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M15.792 4.294H1.208A1.042 1.042 0 0 1 .167 3.253V1.169C.167.594.633.128 1.208.128h14.584c.575 0 1.041.466 1.041 1.041v2.084c0 .575-.466 1.041-1.041 1.041zM14.229 1.43a.781.781 0 1 0 0 1.562.781.781 0 0 0 0-1.562zm-2.083 0a.781.781 0 1 0 0 1.562.781.781 0 0 0 0-1.562zm3.646 8.073H1.208A1.042 1.042 0 0 1 .167 8.46V6.378c0-.576.466-1.042 1.041-1.042h14.584c.575 0 1.041.466 1.041 1.042V8.46c0 .575-.466 1.042-1.041 1.042zm-1.563-2.865a.781.781 0 1 0 0 1.563.781.781 0 0 0 0-1.563zm-2.083 0a.781.781 0 1 0 0 1.563.781.781 0 0 0 0-1.563zm3.646 8.073H1.208a1.042 1.042 0 0 1-1.041-1.042v-2.083c0-.575.466-1.042 1.041-1.042h14.584c.575 0 1.041.467 1.041 1.042v2.083c0 .576-.466 1.042-1.041 1.042zm-1.563-2.865a.781.781 0 1 0 0 1.563.781.781 0 0 0 0-1.563zm-2.083 0a.781.781 0 1 0 0 1.563.781.781 0 0 0 0-1.563z"
          fillRule="nonzero"
          fill={color}
        />
      </svg>
    );
  }
  renderItem(title, info) {
    return (
      <ListViewRow
        height="40"
        padding="5px 10px"
        verticalAlignment="center"
        className="ListViewRow"
        onClick={() =>
          this.setState({
            selected: title
          })
        }
        background={this.state.selected === title ? "#d8dadc" : null}
      >
        {this.renderIcon("running")}
        <Text>
          <h3>{title}</h3>
          <p>{info}</p>
        </Text>
      </ListViewRow>
    );
  }
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
          <h1 className="pl-3 mb-0">Projects</h1>
          <div className="add ListViewHeaderAdd ml-auto">
            <a className="btn btn-primary btn-sm" href="#">
              + New
            </a>
          </div>
        </ListViewHeader>
        <ListViewSection className="ListViewSection">
          {Object.keys(this.props.projects).map(key => (
            <ProjectItem
              key={key}
              index={key}
              details={this.props.projects[key]}
            />
          ))}
        </ListViewSection>
        <ListViewFooter className="ListViewFooter">
          <Text>Status</Text>
        </ListViewFooter>
      </ListView>
    );
  }
}

export default Sidebar;

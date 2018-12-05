import React from 'react';
import electron from 'electron';
import { ListView, ListViewHeader, ListViewFooter, ListViewSection } from 'react-desktop/macOs';
import { NavLink } from 'react-router-dom';

import * as stack from 'Media/stack.svg';
import * as icon from 'Media/Icon.svg';
import * as issue from 'Media/Issue.svg';
import * as settings from 'Media/SettingsBlue.svg';

import ProjectNavItem from 'Components/ProjectNavItem';

class Sidebar extends React.Component {
  render() {
    return (
      <ListView className={this.props.className}>
        <ListViewHeader
          padding="0.8rem 1rem 0.8rem 1rem"
          className="ListViewHeader align-items-center d-flex flex-row w-100"
        >
          <img alt="DDEV UI" src={stack} className="" />
          <h1 className="pl-2 mb-0">Projects</h1>
          <div className="add ListViewHeaderAdd ml-auto">
            <NavLink className="btn btn-outline-primary btn-sm" to="/project/create">
              + New
            </NavLink>
          </div>
        </ListViewHeader>
        {this.props.projects && (
          <ListViewSection className="ListViewSection">
            {Object.keys(this.props.projects).map(key => (
              <ProjectNavItem key={key} index={key} {...this.props.projects[key]} />
            ))}
          </ListViewSection>
        )}
        <ListViewFooter background="transparent" padding="0" className="ListViewFooter">
          <ul className="list-unstyled row no-gutters m-0 p-0">
            <li className="open-docs col col-6 text-center">
              <a
                href="#!"
                className="text-white h-100 d-flex align-content-center align-items-center justify-content-center"
                onClick={e => {
                  e.preventDefault();
                  electron.shell.openExternal('https://ddev.readthedocs.io/en/latest/');
                }}
              >
                <img alt="DDEV Docs" src={icon} className="docs-logo mr-1" />
                <b className="mr-1">DDEV</b> Docs
              </a>
            </li>
            <li className="open-issue col text-center">
              <a
                href="#!"
                className="h-100 d-flex align-content-center align-items-center justify-content-center"
                onClick={e => {
                  e.preventDefault();
                  electron.shell.openExternal('https://github.com/drud/ddev-ui/issues');
                }}
              >
                <img alt="Open Issue" src={issue} className="" />
              </a>
            </li>
            <li className="settings col text-center">
              <NavLink
                className="h-100 d-flex align-content-center align-items-center justify-content-center"
                to="#!"
              >
                <img alt="Settings" src={settings} className="" />
              </NavLink>
            </li>
          </ul>
        </ListViewFooter>
      </ListView>
    );
  }
}

export default Sidebar;

import React from 'react';
import electron from 'electron';
import { ListView, ListViewHeader, ListViewFooter, ListViewSection } from 'react-desktop/macOs';
import { NavLink } from 'react-router-dom';

import ProjectNavItem from './ProjectNavItem';

const stack = require(`${__static}/img/stack.svg`); // eslint-disable-line no-undef,global-require,import/no-dynamic-require
const icon = require(`${__static}/img/Icon.svg`); // eslint-disable-line no-undef,global-require,import/no-dynamic-require
const issue = require(`${__static}/img/Issue.svg`); // eslint-disable-line no-undef,global-require,import/no-dynamic-require
const addSite = require(`${__static}/img/AddSite.svg`); // eslint-disable-line no-undef,global-require,import/no-dynamic-require
const settings = require(`${__static}/img/SettingsBlue.svg`); // eslint-disable-line no-undef,global-require,import/no-dynamic-require

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
                  electron.shell.openExternal('https://github.com/drud/ddev-ui-support/issues');
                }}
              >
                <img alt="Open Issue" src={issue} className="" />
              </a>
            </li>
            <li className="add-site col text-center">
              <NavLink
                className="h-100 d-flex align-content-center align-items-center justify-content-center"
                to="/project/create"
              >
                <img alt="Add Site" src={addSite} className="" />
              </NavLink>
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

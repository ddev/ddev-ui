import React, { PureComponent } from 'react';
import { NavLink } from 'react-router-dom';

import * as stack from 'Media/stack.svg';
import * as cloud from 'Media/cloud.svg';
import * as settings from 'Media/settings.svg';

export default class AppNav extends PureComponent {
  render() {
    return (
      <div className={this.props.className}>
        <div className="app-nav">
          <NavLink className="my-4 d-block text-center" to="/projects" title="Projects">
            <img alt="Projects" src={stack} className="mx-auto" />
            <p className="text-white small">Projects</p>
          </NavLink>
          {/* <NavLink className="my-4 d-block text-center disabled" to="/projects" title="Hosting">
            <img alt="Hosting" src={cloud} className="mx-auto disabled" />
            <p className="text-white small disabled">Hosting</p>
          </NavLink>
          <NavLink className="my-4 d-block text-center disabled" to="/projects" title="Settings">
            <img alt="Settings" src={settings} className="mx-auto disabled" />
            <p className="text-white small disabled">Settings</p>
          </NavLink> */}
        </div>
        <div className="create-new fixed-bottom position-absolute">
          <NavLink
            className="mx-auto my-3 d-block text-center"
            to="/project/create"
            title="Create Project"
          >
            <i className="fa fa-3x fa-plus-circle" aria-hidden="true" />
          </NavLink>
        </div>
      </div>
    );
  }
}

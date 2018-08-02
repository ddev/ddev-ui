import React from "react";
import {
  TitleBar,
  Toolbar,
  ToolbarNav,
  ToolbarNavItem
} from "react-desktop/macOs";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

const logo = require(__static + "/img/Logo.svg");
const stack = require(__static + "/img/stack.svg");
const ddevIcon = require(__static + "/img/Icon.svg");
const cloud = require(__static + "/img/cloud.svg");
const account = require(__static + "/img/account.svg");
const settings = require(__static + "/img/settings.svg");

const AppTitle = () => (
  <div className="app-title d-flex flex-row align-items-center">
    <img alt="DDEV UI" src={ddevIcon} className="" />
    <h1 className="ml-1 d-inline-block">DDEV UI</h1>
  </div>
);

class Header extends React.Component {
  state = {
    selected: 1
  };
  static propTypes = {
    history: PropTypes.object
  };
  render() {
    return (
      <TitleBar
        inset
        height="63"
        className="TitleBar fixed-top"
        isFullscreen={this.state.isFullscreen}
        onCloseClick={() => console.log("Close window")}
        onMinimizeClick={() => console.log("Minimize window")}
        onMaximizeClick={() => console.log("Mazimize window")}
        onResizeClick={() =>
          this.setState({ isFullscreen: !this.state.isFullscreen })
        }
        title={
          <Toolbar className="d-flex flex-column">
            <AppTitle />
            <div className="app-nav d-flex flex-row">
              <div className="history-nav col-4 d-none d-sm-flex flex-row justify-content-start justify-content-md-end pr-0">
                <ToolbarNav className="btn-group btn-group-sm">
                  <ToolbarNavItem
                    icon={
                      <i className="fa fa-chevron-left" aria-hidden="true" />
                    }
                    selected={this.state.selected === 1}
                    onClick={() => this.setState({ selected: 1 })}
                    className="m-0"
                  />
                </ToolbarNav>
                <ToolbarNav className="btn-group btn-group-sm d-flex">
                  <ToolbarNavItem
                    icon={
                      <i className="fa fa-chevron-right" aria-hidden="true" />
                    }
                    selected={this.state.selected === 1}
                    onClick={() => this.setState({ selected: 1 })}
                    className="m-0"
                  />
                </ToolbarNav>
              </div>

              <div className="primary-nav d-flex flex-row col-sm-8 justify-content-center justify-content-md-start pl-1">
                <ToolbarNav className="btn-group btn-group-sm mr-3">
                  <div className="nav-item">
                    <NavLink
                      className="m-0 d-flex flex-column align-items-center"
                      to="/projects"
                    >
                      <div className="h-100  d-flex align-content-center align-items-center justify-content-center">
                        <img alt="DDEV Local" src={stack} className="" />
                      </div>
                    </NavLink>
                  </div>
                  <ToolbarNavItem
                    icon={<img alt="DDEV Live" src={cloud} className="" />}
                    onClick={() => this.setState({ selected: 2 })}
                    className="m-0"
                  />
                  <ToolbarNavItem
                    icon={<img alt="DDEV Live" src={account} className="" />}
                    onClick={() => this.setState({ selected: 3 })}
                    className="m-0"
                  />
                  <ToolbarNavItem
                    icon={<img alt="DDEV Live" src={settings} className="" />}
                    onClick={() => this.setState({ selected: 4 })}
                    className="m-0"
                  />
                </ToolbarNav>
                <ToolbarNav className="btn-group btn-group-sm">
                  <div className="nav-item">
                    <NavLink
                      className="m-0 d-flex flex-column align-items-center"
                      to="/project/create"
                    >
                      <div className="h-100 d-flex align-content-center align-items-center justify-content-center">
                        <i className="fa fa-plus-circle" aria-hidden="true" />
                      </div>
                    </NavLink>
                  </div>
                </ToolbarNav>
              </div>
            </div>
          </Toolbar>
        }
      >
        <img
          alt="ddev logo"
          src={logo}
          className="ddev-logo d-none d-md-block"
        />
      </TitleBar>
    );
  }
}

export default Header;

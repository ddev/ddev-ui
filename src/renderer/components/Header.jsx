import React from "react";
import { TitleBar, Toolbar } from "react-desktop/macOs";
import PropTypes from "prop-types";

class Header extends React.Component {
  constructor() {
    super();
    this.state = { isFullscreen: false };
  }

  render() {
    return (
      <TitleBar
        title="DDEV UI"
        className="TitleBar"
        isFullscreen={this.state.isFullscreen}
        onCloseClick={() => console.log("Close window")}
        onMinimizeClick={() => console.log("Minimize window")}
        onMaximizeClick={() => console.log("Mazimize window")}
        onResizeClick={() =>
          this.setState({ isFullscreen: !this.state.isFullscreen })
        }
      >
        <img alt="ddev logo" src="/img/Logo.svg" className="ddev-logo" />
      </TitleBar>
    );
  }
}

export default Header;

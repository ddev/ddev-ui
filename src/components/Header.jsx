import React from 'react';

class Header extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-toggleable-md navbar-inverse fixed-top bg-inverse">
        <img
          alt="ddev logo"
          src="resources/img/ddev_last.png"
          className="ddev-logo"
        />
      </nav>
    );
  }
}

export default Header;

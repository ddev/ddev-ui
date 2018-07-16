import React from 'react';

class Header extends React.Component {
  render() {
    return (
      <nav className="navbar fixed-top">
        <img
          alt="ddev logo"
          src="resources/img/logo.svg"
          className="ddev-logo"
        />
      </nav>
    );
  }
}

export default Header;

import React from 'react';
import HeaderLogo from '../../components/HeaderLogo/index.jsx';

const Header = () =>
  (
    <nav className="navbar navbar-toggleable-md navbar-inverse bg-inverse">
      <HeaderLogo imagePath="img/ddev_last.png" />
    </nav>
  );

export default Header;

import React from 'react';
import '../../sass/header.scss';
import DDEVLogo from '../../img/ddev_last.png';

function Header() {
  return (
    <div className="header">
      <img className="ddev-logo" src={DDEVLogo} alt="DDEV Company Logo" />
    </div>
  );
}

export default Header;

import React from 'react';
import PropTypes from 'prop-types';
import HeaderLogo from '../../components/HeaderLogo/index';

const Header = ({ logoPath }) =>
  (
    <nav className="navbar navbar-toggleable-md navbar-inverse bg-inverse">
      <HeaderLogo imagePath={logoPath} />
    </nav>
  );

Header.propTypes = {
  logoPath: PropTypes.string.isRequired,
};

export default Header;

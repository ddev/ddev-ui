import React from 'react';
import PropTypes from 'prop-types';

const HeaderLogo = ({ imagePath }) =>
  (
    <img alt="ddev logo" src={imagePath} className="ddev-logo" />
  );

HeaderLogo.propTypes = {
  imagePath: PropTypes.string.isRequired,
};

export default HeaderLogo;
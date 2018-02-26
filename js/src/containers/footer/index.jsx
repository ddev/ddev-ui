import React from 'react';
import PropTypes from 'prop-types';
import RouterStatus from '../../components/RouterStatus/index.jsx';

const Footer = ({ status }) =>
  (
    <footer className="footer">
      <RouterStatus routerStatus={status} />
    </footer>
  );

Footer.propTypes = {
  status: PropTypes.string.isRequired,
};

export default Footer;

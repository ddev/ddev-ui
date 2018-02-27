import React from 'react';
import PropTypes from 'prop-types';
import RouterStatus from '../../components/RouterStatus';

const Footer = ({ status }) =>
  (
    <footer className="footer">
      <RouterStatus routerStatus={status} />
    </footer>
  );

Footer.propTypes = {
  status: PropTypes.object.isRequired,
};

export default Footer;

import React from 'react';
import PropTypes from 'prop-types';

const RouterStatus = ({ routerStatus }) =>
  (
    <div className="router-status-container">
      <div className="router-status-label">{routerStatus.text}</div>
    </div>
  );

RouterStatus.propTypes = {
  routerStatus: PropTypes.object.isRequired,
};

export default RouterStatus;

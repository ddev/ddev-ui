import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-bootstrap';
import '../../sass/card.scss';

function SiteCard({ siteData }) {
  return (
    <Col className="card-container" xs={12} sm={6} md={4} lg={3} xl={2}>
      <div className="card">
        <h2>{ siteData.name }</h2>
      </div>
    </Col>
  );
}

SiteCard.propTypes = {
  siteData: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default SiteCard;

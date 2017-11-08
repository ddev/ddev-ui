import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row } from 'react-bootstrap';
import '../../sass/body.scss';
import SiteCard from './sitecard';

function renderSiteCard(siteData) {
  return <SiteCard siteData={siteData} />;
}

function Body({ sites }) {
  return (
    <div className="main-panel">
      <Grid>
        <Row>
          {sites.map(i => renderSiteCard(i))}
        </Row>
      </Grid>
    </div>
  );
}

Body.propTypes = {
  sites: PropTypes.arrayOf(PropTypes.object),
};

Body.defaultProps = {
  sites: [],
};

export default Body;

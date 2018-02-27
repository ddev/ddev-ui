import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import HeaderContainer from '../../containers/header';
import FooterContainer from '../../containers/footer';
import DashboardContainer from '../../containers/dashboard';
import * as RouterStatusActions from '../../reducers/routerStatus';

const ui = require('../../ui.js');
require('./main.scss');

class App extends Component {
  componentDidMount() {
    ui.init(this.props.actions);
  }
  render() {
    const { routerStatus } = this.props;
    return (
      <div>
        <HeaderContainer />
        <DashboardContainer />
        <FooterContainer status={routerStatus} />
      </div>
    );
  }
}

App.propTypes = {
  routerStatus: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    routerStatus: state.routerStatus,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(RouterStatusActions, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);

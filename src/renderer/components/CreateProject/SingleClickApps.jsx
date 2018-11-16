import React, { Component } from 'react';
import FormProjectInfo from './FormProjectInfo';

export default class SingleClickApps extends Component {
  render() {
    return <FormProjectInfo {...this.props} />;
  }
}

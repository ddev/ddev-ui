import React, { Component } from 'react';
import FormProjectInfo from './FormProjectInfo';

export default class CleanContainer extends Component {
  render() {
    return <FormProjectInfo className="CleanContainer" {...this.props} />;
  }
}

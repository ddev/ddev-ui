import React, { Component } from 'react';
import { Alert } from 'reactstrap';
import * as issue from 'Media/Issue.svg';

export default class Alpha extends Component {
  state = {
    visible: true,
  };

  onDismiss = () => {
    this.setState({ visible: false });
  };

  render() {
    return (
      <div className="alpha mt-3">
        <Alert color="info" isOpen={this.state.visible} toggle={this.onDismiss}>
          Thanks for testing out the Alpha and pardon the mess!
          <br />
          <br />
          <small>
            If you find any issues, something seems off, or is just flat out not working let us
            know. We are also looking for your feedback for future releases. Look for the{' '}
            <img alt="Open Issue" src={issue} className="" /> icon in the bottom of the sidebar to
            submit any issues or feedback you might have.
          </small>
        </Alert>
      </div>
    );
  }
}

import React from 'react';

const issue = require(`${__static}/img/Issue.svg`); // eslint-disable-line no-undef,global-require,import/no-dynamic-require

const Alpha = () => (
  <div className="alert alert-info alert-dismissible fade show" role="alert">
    Thanks for testing out the Alpha and pardon the mess!
    <br />
    <br />
    <small>
      If you find any issues, something seems off, or is just flat out not working let us know. We
      are also looking for your feedback for future releases. Look for the{' '}
      <img alt="Open Issue" src={issue} className="" /> icon in the bottom of the sidebar to submit
      any issues or feedback you might have.
    </small>
    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
);

// define the Alert component
const Alert = props => (
  <div className={`alert alert-${props.type} alert-dismissible fade show`} role="alert">
    {props.msg}
    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
);

// define the Alerts component
class Alerts extends React.PureComponent {
  renderAlert = (type, key) => {
    let alertType = 'primary';
    switch (type) {
      case 'docker':
        alertType = 'warning';
        break;

      default:
        break;
    }
    return <Alert key={key} id={key} msg={this.props.errors[type][key].msg} type={alertType} />;
  };

  renderAlertType(type) {
    let alertTypes = null;
    if (type === 'docker') {
      // send only the first alert for now
      alertTypes = this.renderAlert(type, Object.keys(this.props.errors[type])[0]);
    } else {
      alertTypes = Object.keys(this.props.errors[type]).map(key => this.renderAlert(type, key));
    }
    return alertTypes;
  }

  render() {
    let alerts;
    // find errors stored in state
    if (this.props.errors) {
      alerts = Object.keys(this.props.errors).map(type => this.renderAlertType(type));
    }

    return (
      <div className="alerts mt-3">
        {alerts}
        <Alpha />
      </div>
    );
  }
}

export default Alerts;

import React from "react";
import Alert from "./Alert";
class Alerts extends React.Component {
  render() {
    // find errors stored in state
    const alerts = Object.keys(this.props.errors).map(key => (
      <Alert
        key={key}
        id={key}
        type={this.props.errors[key].type}
        msg={this.props.errors[key].msg}
      />
    ));
    return <div className="alerts container">{alerts}</div>;
  }
}

export default Alerts;

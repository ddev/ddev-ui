import React from "react";

class Alerts extends React.Component {
  render() {
    const alerts = Object.keys(this.props.errors).map(key => (
      <div
        className="alert alert-warning alert-dismissible fade show"
        role="alert"
        key={key}
        id={key}
      >
        {this.props.errors[key].msg}
        <button
          type="button"
          className="close"
          data-dismiss="alert"
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    ));
    return <div className="alerts container">{alerts}</div>;
  }
}

// export default Router;
export default Alerts;

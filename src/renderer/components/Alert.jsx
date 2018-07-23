import React from "react";

class Alert extends React.Component {
  render() {
    return (
      <div
        className={`alert alert-${
          this.props.style
        } alert-dismissible fade show`}
        role="alert"
      >
        {this.props.msg}
        <button
          type="button"
          className="close"
          data-dismiss="alert"
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    );
  }
}

export default Alert;

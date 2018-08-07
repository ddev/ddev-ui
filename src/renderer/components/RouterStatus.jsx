import React from 'react';

class RouterStatus extends React.Component {
  render() {
    return (
      <div className={`router-status ${this.props.className ? this.props.className : ''}`}>
        <p className="text-center text-md-left m-0">
          <b>DDEV Router:</b> Stable
        </p>
      </div>
    );
  }
}

export default RouterStatus;

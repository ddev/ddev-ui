import React from 'react';

class Container extends React.Component {
  render() {
    return (
      <div>
        <nav className="navbar navbar-toggleable-md navbar-inverse bg-inverse">
          <img alt="ddev logo" src="img/ddev_last.png" className="ddev-logo" />
        </nav>
        <div className="container-fluid">
          <div className="row card-container" />
        </div>
      </div>
    );
  }
}

export default Container;


import React from 'react';

class Dashboard extends React.Component {
  render() {
    return (
      <div>
        <nav className="navbar navbar-toggleable-md navbar-inverse fixed-top bg-inverse">
          <img alt="ddev logo" src="img/ddev_last.png" className="ddev-logo" />
        </nav>
        <div className="container">
          <div className="row card-container" />
        </div>
      </div>
    );
  }
}

export default Dashboard;


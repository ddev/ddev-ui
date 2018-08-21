import React from 'react';

import ProjectCount from './ProjectCount';
import RouterStatus from './RouterStatus';

class Footer extends React.PureComponent {
  render() {
    return (
      <footer className="footer fixed-bottom">
        <div className="container-fluid">
          <div className="row">
            <ProjectCount projects={this.props.projects} className="col-md-4 d-none d-md-block" />
            <div className="col-md-8">
              <div className="row">
                <RouterStatus router={this.props.router} className="col-md-12" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;

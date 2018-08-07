import React from 'react';

import ProjectCount from './ProjectCount';
import RouterStatus from './RouterStatus';

class Footer extends React.Component {
  render() {
    return (
      <footer className="footer fixed-bottom">
        <div className="container-fluid">
          <div className="row">
            <ProjectCount className="col-md-4 d-none d-md-block" />
            <div className="col-md-8">
              <div className="row">
                <RouterStatus className="col-md-7" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;

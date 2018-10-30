import React from 'react';
import { BarLoader } from 'react-spinners';
import { version } from 'ddev-shell';
import { pause } from 'helpers';

import * as icon from 'Media/Icon.svg';

class ValidateDDEV extends React.Component {
  state = {
    validInstall: null,
    reCheck: false,
  };

  componentDidMount() {
    this.validate();
  }

  componentDidUpdate() {
    if (this.state.reCheck && [null, false].indexOf(this.state.validInstall) > -1) {
      this.validate();
      this.setState({ reCheck: false });
    }
  }

  validate = () => {
    pause(1500)
      .then(() => version())
      .then(result => {
        this.setState({ validInstall: true });
        return pause(1500);
      })
      .then(() => this.props.validateView('DDEV'))
      .catch(err => {
        this.setState({ validInstall: false });
      });
  };

  uintToString = uintArray => {
    const encodedString = String.fromCharCode.apply(null, uintArray);
    const decodedString = decodeURIComponent(escape(encodedString));
    return decodedString;
  };

  render() {
    return (
      <div className="system-check-panel h-100 row align-items-center justify-content-md-center">
        <div className="col-md-10 text-center">
          <div className="d-flex flex-column flex-md-row align-items-center">
            <div className="col-md-5">
              {(() => {
                switch (this.state.validInstall) {
                  case true:
                    return (
                      <figure className="system-check-media">
                        <img src={icon} className="figure-img img-fluid logo faded" alt="DDEV" />
                        <figcaption className="figure-caption float">
                          <div className="status text-success border border-success rounded-circle">
                            <i className="fa fa-2x fa-check" aria-hidden="true" />
                          </div>
                        </figcaption>
                      </figure>
                    );
                  case false:
                    return (
                      <figure className="system-check-media">
                        <img src={icon} className="figure-img img-fluid logo faded" alt="DDEV" />
                        <figcaption className="figure-caption float">
                          <div className="status text-danger border border-danger rounded-circle">
                            <i className="fa fa-2x fa-exclamation" aria-hidden="true" />
                          </div>
                        </figcaption>
                      </figure>
                    );
                  default:
                    return (
                      <figure className="system-check-media">
                        <img src={icon} className="figure-img img-fluid logo pulse" alt="DDEV" />
                        <figcaption className="figure-caption d-none d-lg-block">
                          <BarLoader width={40} widthUnit="%" color="#236192" />
                        </figcaption>
                        <figcaption className="figure-caption d-lg-none">
                          <BarLoader width={30} widthUnit="%" color="#236192" />
                        </figcaption>
                      </figure>
                    );
                }
              })()}
            </div>
            <div className="col-md-6 offset-md-1 text-md-left">
              {(() => {
                switch (this.state.validInstall) {
                  case true:
                    return (
                      <div className="mx-4">
                        <h1>DDEV CLI Installed!</h1>
                        <p>The DDEV-CLI is installed and the UI can communicate!</p>
                      </div>
                    );
                  case false:
                    return (
                      <div className="mx-4">
                        <h1>DDEV CLI does NOT seem to be installed!</h1>
                        <p>
                          To run DDEV-UI DDEV CLI must be installed and in your path. We are
                          verifying the UI can communicate with the DDEV CLI and is the proper
                          version.
                        </p>
                        <div className="btn-group w-75">
                          <button
                            type="button"
                            className="btn btn-outline-primary w-50"
                            onClick={() => {
                              this.setState({ validInstall: null, reCheck: true });
                            }}
                          >
                            Retry
                          </button>
                          <button type="button" className="btn btn-outline-secondary w-50">
                            Install
                          </button>
                        </div>
                      </div>
                    );
                  default:
                    return (
                      <div className="mx-4">
                        <h1>Checking for DDEV CLI</h1>
                        <p>
                          To run DDEV-UI DDEV CLI must be installed and in your path. We are
                          verifying the UI can communicate with the DDEV CLI and is the proper
                          version.
                        </p>
                      </div>
                    );
                }
              })()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default ValidateDDEV;

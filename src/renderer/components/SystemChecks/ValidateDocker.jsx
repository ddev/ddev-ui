import React from 'react';
import electron from 'electron';

import { BarLoader } from 'react-spinners';
import { list } from '../../ddev-shell';
import { pause } from '../../helpers';

const docker = require(`${__static}/img/Docker.svg`); // eslint-disable-line no-undef,global-require,import/no-dynamic-require

class ValidateDocker extends React.Component {
  state = {
    validInstall: null,
    reCheck: false,
    errorMessage:
      'To run the DDEV-UI Docker must be installed and running. We are verifying the UI can communicate with the Docker and is the proper version.',
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
    pause(2000)
      .then(() => list())
      .then(result => {
        this.setState({ validInstall: true });
        return pause(2000);
      })
      .then(() => this.props.validateView('Docker'))
      .then(() => this.props.completeChecks())
      .catch(err => {
        try {
          this.setState({ errorMessage: JSON.parse(err).msg });
        } catch (error) {
          console.log(error);
        }
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
                        <img src={docker} className="figure-img img-fluid logo" alt="DDEV" />
                        <figcaption className="figure-caption">
                          <div className="status text-success border border-success rounded-circle">
                            <i className="fa fa-5x fa-check" aria-hidden="true" />
                          </div>
                        </figcaption>
                      </figure>
                    );
                  case false:
                    return (
                      <figure className="system-check-media">
                        <img src={docker} className="figure-img img-fluid logo" alt="DDEV" />
                        <figcaption className="figure-caption">
                          <div className="status text-danger border border-danger rounded-circle">
                            <i className="fa fa-5x fa-exclamation" aria-hidden="true" />
                          </div>
                        </figcaption>
                      </figure>
                    );
                  default:
                    return (
                      <figure className="system-check-media">
                        <img src={docker} className="figure-img img-fluid logo pulse" alt="DDEV" />
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
                        <h1>Docker is Installed!</h1>
                        <p>
                          Docker is installed with the proper version and the UI can communicate
                          with it!
                        </p>
                      </div>
                    );
                  case false:
                    return (
                      <div className="mx-4">
                        <h1>Issue with Docker!</h1>
                        <p>{this.state.errorMessage}</p>
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
                          <button
                            type="button"
                            className="btn btn-outline-secondary w-50"
                            onClick={() =>
                              electron.shell.openExternal(
                                'https://www.docker.com/products/docker-desktop/'
                              )
                            }
                          >
                            Install
                          </button>
                        </div>
                      </div>
                    );
                  default:
                    return (
                      <div className="mx-4">
                        <h1>Checking for Docker</h1>
                        <p>{this.state.errorMessage}</p>
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
export default ValidateDocker;

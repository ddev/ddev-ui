import React from 'react';

import * as drupalLogo from '../../../resources/imgs/druplicon-vector.svg';
import * as wordpressLogo from '../../../resources/imgs/wordpress-vector.svg';
import * as typo3Logo from '../../../resources/imgs/typo3.svg';
import * as backdropLogo from '../../../resources/imgs/Backdrop-vector.svg';
import * as phpLogo from '../../../resources/imgs/PHPApp.svg';

class CmsSettings extends React.PureComponent {
  render() {
    return (
      <div className="setup-content" id="step-3" key="createProjectStep3">
        <div className="row">
          <div className="col-md-12">
            <h3 className="text-center">Platform Setup</h3>
            <div className="form-group">
              <div className="card-deck">
                <div className={`card ${this.props.cmsType === 'drupal' ? 'active' : ''}`}>
                  <a
                    href="!#"
                    className="text-center"
                    cms="drupal"
                    onClick={this.props.handleCmsUpdate}
                  >
                    <img src={drupalLogo} alt="Drupal" className="" />
                  </a>
                </div>
                <div className={`card ${this.props.cmsType === 'wordpress' ? 'active' : ''}`}>
                  <a
                    href="!#"
                    className="text-center"
                    cms="wordpress"
                    onClick={this.props.handleCmsUpdate}
                  >
                    <img src={wordpressLogo} alt="WordPress" className="" />
                  </a>
                </div>
                <div className={`card ${this.props.cmsType === 'backdrop' ? 'active' : ''}`}>
                  <a
                    href="!#"
                    className="text-center btn disabled"
                    cms="backdrop"
                    onClick={this.props.handleCmsUpdate}
                  >
                    <img src={backdropLogo} alt="BackDrop" className="" />
                  </a>
                </div>
                <div className={`card ${this.props.cmsType === 'typo3' ? 'active' : ''}`}>
                  <a
                    href="!#"
                    className="text-center btn disabled"
                    cms="typo3"
                    onClick={this.props.handleCmsUpdate}
                  >
                    <img src={typo3Logo} alt="Typo3" className="" />
                  </a>
                </div>
                <div className={`card ${this.props.cmsType === 'none' ? 'active' : ''}`}>
                  <a
                    href="!#"
                    className="text-center btn disabled"
                    cms="none"
                    onClick={this.props.handleCmsUpdate}
                  >
                    <img src={phpLogo} alt="PHP Application" className="" />
                  </a>
                </div>
              </div>
            </div>
            <div className="form-group">
              {this.props.cmsType === 'drupal' && (
                <div className="">
                  <div className="form-inline">
                    <div className="form-group form-row">
                      <label className="control-label mr-2" htmlFor="cmsVersion">
                        Version:
                      </label>
                      <select
                        name="cmsVersion"
                        id="cmsVersion"
                        className="form-control form-control-lg"
                        value={this.props.cmsVersion}
                        onChange={this.props.handleInputChange}
                      >
                        <option value="">latest</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="form-group clearix">
              <button
                className="btn btn-outline-secondary pull-left"
                step="2"
                onClick={this.props.handlePrevStep}
                type="button"
              >
                Back
              </button>
              <button className="btn btn-primary pull-right" type="submit">
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CmsSettings;

import React from 'react';

class WizardSteps extends React.Component {
  render() {
    return (
      <div className="stepwizard fixed-bottom">
        <div className="stepwizard-row form-row h-100 btn-breadcrumb align-items-center setup-panel clearfix">
          {/* Step 1 */}
          <div className="stepwizard-step col-4">
            <a href="#step-1" type="button" className="btn btn-outline-primary btn-circle">
              1
            </a>
            <span>Project Setup</span>
          </div>
          {/* Step 2 */}
          <div className="stepwizard-step col-4">
            <a
              href="#step-2"
              type="button"
              className="btn btn-outline-secondary btn-circle"
              disabled
            >
              2
            </a>
            <span>Container Settings</span>
          </div>
          {/* Step 3 */}
          <div className="stepwizard-step col-4">
            <a
              href="#step-3"
              type="button"
              className="btn btn-outline-secondary btn-circle"
              disabled
            >
              3
            </a>
            <span>Platform Setup</span>
          </div>
        </div>
      </div>
    );
  }
}

export default WizardSteps;

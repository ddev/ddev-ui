import React from 'react';

class WizardSteps extends React.PureComponent {
  render() {
    return (
      <div className="stepwizard fixed-bottom">
        <div className="stepwizard-row form-row h-100 btn-breadcrumb align-items-center setup-panel clearfix">
          {/* Step 1 */}
          <div className="stepwizard-step col-4">
            <span
              className={`border ${
                this.props.activeStep === '1' ? 'border-primary' : 'border-secondary'
              } btn-circle`}
            >
              1
            </span>
            <span>Project Setup</span>
          </div>
          {/* Step 2 */}
          <div className="stepwizard-step col-4">
            <span
              className={`border ${
                this.props.activeStep === '2' ? 'border-primary' : 'border-secondary'
              } btn-circle`}
            >
              2
            </span>
            <span>Container Settings</span>
          </div>
          {/* Step 3 */}
          <div className="stepwizard-step col-4">
            <span
              className={`border ${
                this.props.activeStep === '3' ? 'border-primary' : 'border-secondary'
              } btn-circle`}
            >
              3
            </span>
            <span>Platform Setup</span>
          </div>
        </div>
      </div>
    );
  }
}

export default WizardSteps;

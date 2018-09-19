import React from 'react';

import ValidateDDEV from './SystemChecks/ValidateDDEV';
import ValidateDocker from './SystemChecks/ValidateDocker';

class AppLoading extends React.Component {
  state = {
    activeView: 'DDEV',
    haveProjects: false,
  };

  updateView = view => {
    this.setState({ activeView: view });
  };

  validateView = view => {
    switch (view) {
      case 'DDEV':
        this.setState({ activeView: 'Docker' });
        break;

      case 'Docker':
        this.setState({ activeView: 'Logging' });
        break;

      default:
        break;
    }
  };

  render() {
    return (
      <div className="system-check container-fluid">
        {(() => {
          switch (this.state.activeView) {
            case 'DDEV':
              return <ValidateDDEV validateView={this.validateView} />;

            case 'Docker':
              return (
                <ValidateDocker
                  completeChecks={this.props.completeChecks}
                  validateView={this.validateView}
                />
              );

            default:
              return null;
          }
        })()}
      </div>
    );
  }
}

export default AppLoading;

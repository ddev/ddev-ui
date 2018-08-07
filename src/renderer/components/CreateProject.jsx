import React from 'react';

import CreateProjectWizard from './CreateProjectWizard';
import CreateProjectOld from './CreateProjectOld';

class CreateProject extends React.Component {
  render() {
    return (
      <div className="create-project">
        {console.log(this.props)}
        {/* <CreateProjectOld /> */}
        {/* <CreateProjectWizard /> */}
        <CreateProjectOld history={this.props.history} addError={this.props.addError} />
      </div>
    );
  }
}

export default CreateProject;

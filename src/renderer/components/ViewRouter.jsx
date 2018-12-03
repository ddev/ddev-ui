import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

import ProjectDetail from 'Components/ProjectDetail';
import CreateProjectWizard from 'Components/CreateProjectWizard';

class ViewRouter extends React.PureComponent {
  render() {
    return (
      <HashRouter>
        <Switch>
          <Route
            path="/project/create"
            render={routeProps => <CreateProjectWizard {...routeProps} />}
          />
          <Route
            path="/project/:projectID"
            render={routeProps => (
              <ProjectDetail
                {...routeProps}
                project={this.props.projects[routeProps.match.params.projectID]}
              />
            )}
          />
          <Route
            render={routeProps => (
              <CreateProjectWizard {...routeProps} addError={this.props.addError} />
            )}
          />
        </Switch>
      </HashRouter>
    );
  }
}

export default ViewRouter;

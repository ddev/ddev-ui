import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

import ProjectList from './ProjectList';
import ProjectDetail from './ProjectDetail';
import CreateProjectWizard from './CreateProjectWizard';

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
            render={routeProps => <ProjectList {...routeProps} projects={this.props.projects} />}
          />
        </Switch>
      </HashRouter>
    );
  }
}

export default ViewRouter;

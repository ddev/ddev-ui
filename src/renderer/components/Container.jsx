import React from "react";
import { HashRouter, Route, PropsRoute, Switch } from "react-router-dom";

import ProjectList from "./ProjectList";
import ProjectDetail from "./ProjectDetail";

class Container extends React.Component {
  render() {
    return (
      <HashRouter>
        <Switch>
          <Route
            path="/project/:projectID"
            render={routeProps => (
              <ProjectDetail
                {...routeProps}
                projects={this.props.projects}
                addError={this.props.addError}
              />
            )}
          />
          <Route
            render={routeProps => (
              <ProjectList
                {...routeProps}
                projects={this.props.projects}
                addError={this.props.addError}
              />
            )}
          />
        </Switch>
      </HashRouter>
    );
  }
}

export default Container;

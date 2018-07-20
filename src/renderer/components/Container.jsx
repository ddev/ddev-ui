import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";

import ProjectList from "./ProjectList";
import ProjectDetail from "./ProjectDetail";

class Container extends React.Component {
  render() {
    return (
      <HashRouter>
        <Switch>
          <Route path="/project/:projectID" component={ProjectDetail} />
          <Route
            render={() => <ProjectList projects={this.props.projects} />}
          />
        </Switch>
      </HashRouter>
    );
  }
}

export default Container;

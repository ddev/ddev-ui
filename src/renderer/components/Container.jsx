import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";

import Welcome from "./Welcome";
import ProjectList from "./ProjectList";
import ProjectDetail from "./ProjectDetail";

const Container = () => (
  <HashRouter>
    <Switch>
      <Route exact path="/" component={Welcome} />
      <Route forceRefresh path="/app" component={ProjectList} />
      <Route
        forceRefresh
        path="/project/:projectID"
        component={ProjectDetail}
      />
    </Switch>
  </HashRouter>
);

export default Container;

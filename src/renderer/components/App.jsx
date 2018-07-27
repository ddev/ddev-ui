import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";

import Dashboard from "./Dashboard";

const App = () => (
  <HashRouter>
    <Switch>
      <Route component={Dashboard} />
    </Switch>
  </HashRouter>
);

export default App;

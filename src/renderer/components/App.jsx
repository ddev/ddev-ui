import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";

import "popper.js";
import "bootstrap";
window.$ = window.jQuery = require("jquery");

import Dashboard from "./Dashboard";

const App = () => (
  <HashRouter>
    <Switch>
      <Route component={Dashboard} />
    </Switch>
  </HashRouter>
);

export default App;

import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";

import App from "./App";

const Router = () => (
  <HashRouter>
    <Switch>
      <Route component={App} />
    </Switch>
  </HashRouter>
);

// export default Router;
export default Router;

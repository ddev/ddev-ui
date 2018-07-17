import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Welcome from "./Welcome";
import App from "./App";

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Welcome} />
      <Route forceRefresh path="/app" component={App} />
    </Switch>
  </BrowserRouter>
);

// export default Router;
export default Router;

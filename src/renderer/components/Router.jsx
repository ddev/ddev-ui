import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

import App from './App';

const Router = () => (
  <HashRouter>
    <Switch>
      <Route exact path="/" component={App} />
    </Switch>
  </HashRouter>
);

export default Router;

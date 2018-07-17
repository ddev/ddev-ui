import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { hot } from 'react-hot-loader';

import App from './App';

const Router = () => (
  <HashRouter>
    <Switch>
      <Route exact path="/" component={App} />
    </Switch>
  </HashRouter>
);

// export default Router;
export default hot(module)(Router);

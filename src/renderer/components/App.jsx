import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

import 'popper.js';
import 'bootstrap';

import Dashboard from './Dashboard';
// app styling
import '~/src/resources/scss/main.scss'; // eslint-disable-line import/no-unresolved

window.$ = window.jQuery = require('jquery'); // eslint-disable-line no-multi-assign

const App = () => (
  <HashRouter>
    <Switch>
      <Route component={Dashboard} />
    </Switch>
  </HashRouter>
);

export default App;

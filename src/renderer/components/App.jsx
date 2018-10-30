import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import ErrorBoundary from 'react-error-boundary';

import 'popper.js';
import 'bootstrap';

import Dashboard from 'Components/Dashboard';
import AppLoading from 'Components/AppLoading';

// app styling
import '~/src/resources/scss/main.scss'; // eslint-disable-line import/no-unresolved

window.$ = window.jQuery = require('jquery'); // eslint-disable-line no-multi-assign

class App extends React.Component {
  state = {
    completedChecks: false,
  };

  completeChecks = () => {
    this.setState({ completedChecks: true });
  };

  triggerChecks = () => {
    this.setState({ completedChecks: false });
  };

  render() {
    return (
      <HashRouter>
        <Switch>
          <Route
            render={routeProps => {
              if (this.state.completedChecks) {
                return (
                  <ErrorBoundary>
                    <Dashboard {...routeProps} triggerChecks={this.triggerChecks} />
                  </ErrorBoundary>
                );
              }
              return (
                <ErrorBoundary>
                  <AppLoading {...routeProps} completeChecks={this.completeChecks} />
                </ErrorBoundary>
              );
            }}
          />
        </Switch>
      </HashRouter>
    );
  }
}

export default App;

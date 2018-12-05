import React, { PureComponent } from 'react';
import AppNav from 'Components/AppNav';

import * as ddevIcon from 'Media/IconYellow.svg';

export default class Header extends PureComponent {
  render() {
    return (
      <header className="app-header p-2 col-auto h-100">
        <img
          alt="DDEV UI"
          src={ddevIcon}
          className="app-logo mx-auto mb-3 mt-4 d-block text-white"
        />
        <AppNav />
      </header>
    );
  }
}

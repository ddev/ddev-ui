import React from 'react';
import { Window, TitleBar, Toolbar } from 'react-desktop/macOs';

import 'popper.js';
import 'bootstrap';

import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import Container from './Container';

import { init } from './../modules/ui';

window.$ = window.jQuery = require('jquery');

const circle = (
  <svg x="0px" y="0px" width="25px" height="25px" viewBox="0 0 25 25">
    <circle cx="12.5" cy="12.5" r="12.5" />
  </svg>
);

const star = (
  <svg x="0px" y="0px" width="25px" height="23.8px" viewBox="0 0 25 23.8">
    <polygon points="12.5,0 16.4,7.8 25,9.1 18.8,15.2 20.2,23.8 12.5,19.7 4.8,23.8 6.2,15.2 0,9.1 8.6,7.8 " />
  </svg>
);

const polygon = (
  <svg x="0px" y="0px" width="25px" height="21.7px" viewBox="0 0 25 21.7">
    <polygon points="6.2,21.7 0,10.8 6.2,0 18.8,0 25,10.8 18.8,21.7 " />
  </svg>
);

class App extends React.Component {
  constructor() {
    super();
    this.state = { selected: 1 };
  }
  componentDidMount() {
    init();
  }
  render() {
    return (
      <Window chrome>
        <TitleBar
          isFullscreen={this.state.isFullscreen}
          onCloseClick={() => console.log('Close window')}
          onMinimizeClick={() => console.log('Minimize window')}
          onMaximizeClick={() => console.log('Mazimize window')}
          onResizeClick={() =>
            this.setState({ isFullscreen: !this.state.isFullscreen })
          }
        >
          <Toolbar
            verticalAlignment="center"
            horizontalAlignment="left"
            height="50px"
          />
        </TitleBar>
        <Header />
        <Sidebar />
        <Container />
        <Footer />
      </Window>
    );
  }
}

export default App;

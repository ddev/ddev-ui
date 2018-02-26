import React from 'react';
import { render } from 'react-dom';
import HeaderContainer from './containers/header/index.jsx';
import FooterContainer from './containers/footer/index.jsx';
import Container from "./container.jsx";

const ui = require('./ui.js');
require('../../scss/main.scss');

class App extends React.Component {
  componentDidMount() {
    ui.init();
  }

  render() {
    return (
      <div>
        <HeaderContainer />
        <Container />
        <FooterContainer status="" />
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
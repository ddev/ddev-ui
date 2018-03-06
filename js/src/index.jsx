import React from 'react';
import { render } from 'react-dom';
import Header from './header.jsx';
import Footer from './footer.jsx';
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
        <Header />
        <Container />
        <Footer />
      </div>
    );
  }
}

render(<App />, document.getElementById('app'));
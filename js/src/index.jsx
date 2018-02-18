import React from 'react';
import { render } from 'react-dom';
import Header from './header.jsx';
import Footer from './footer.jsx';
import Container from "./container.jsx";

require('../../scss/main.scss');

class App extends React.Component {
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
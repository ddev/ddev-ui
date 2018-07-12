import React from 'react';
import 'popper.js';
import 'bootstrap';

import Header from './Header';
import Footer from './Footer';
import Container from './Container';

import { init } from './../modules/ui';

window.$ = window.jQuery = require('jquery');

export default class extends React.Component {
  componentDidMount() {
    init();
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

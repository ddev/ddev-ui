import React from "react";
import { Window } from "react-desktop/macOs";
import path from "path";

import "popper.js";
import "bootstrap";

import(`${__static}/scss/main.scss`);

window.$ = window.jQuery = require("jquery");

import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Container from "./Container";

import { init } from "./../modules/ui";

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
      <Window chrome padding="0px">
        <Header />
        <Sidebar />
        <Container />
        <Footer />
      </Window>
    );
  }
}

export default App;

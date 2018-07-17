import React from "react";
import { Window } from "react-desktop/macOs";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

import "popper.js";
import "bootstrap";
window.$ = window.jQuery = require("jquery");

import "~/src/resources/scss/main.scss";

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
      <Window chrome padding="0px" className="Window">
        <div className="wrap">
          <Header />
          <section className="Main">
            <NavLink to="/app">TESTING</NavLink>
            <Container />
          </section>
          <Footer />
        </div>
      </Window>
    );
  }
}

export default App;

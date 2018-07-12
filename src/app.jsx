import React from "react";
import "popper.js";
import "bootstrap";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Container from "./components/Container";

import { init } from "./ui.js";

window.$ = window.jQuery = require("jquery");

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

import React from "react";
import { Window } from "react-desktop/macOs";

const ddevShell = require("../modules/ddev-shell");

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
  state = {
    projects: {}
  };
  componentDidMount() {
    // TODO: Remove this once everything is moved over
    init();
    // Inital state load
    this.fetchState();
    // TODO: this could be reduced once state is updated with the response of the calls.
    setInterval(this.tick, 3000);
  }
  fetchState = () => {
    ddevShell
      .list()
      .then(data => {
        // console.log(data);
        this.loadProjects(data);
      })
      .catch(() => {
        // TODO:
        console.log("'ddev list -j' didn't return results or had an error");
      });
  };
  loadProjects = projects => {
    this.setState({ projects: projects });
  };
  tick = () => {
    this.fetchState();
  };
  render() {
    return (
      <Window chrome padding="0px" className="Window">
        <div className="wrap">
          <Header />
          <section className="Main">
            <Sidebar projects={this.state.projects} />
            <Container projects={this.state.projects} />
          </section>
          <Footer />
        </div>
      </Window>
    );
  }
}

export default App;
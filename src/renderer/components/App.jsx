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
import Alerts from "./Alerts";

import { init } from "./../modules/ui";
import { getErrorResponseType } from "./../modules/helpers";
import { isObject } from "../../../node_modules/util";

class App extends React.Component {
  state = {
    projects: {},
    errors: {}
  };
  componentDidMount() {
    // TODO: Remove this once everything is moved over
    init();
    // Initial state load
    this.fetchState();
    // TODO: this could be reduced/removed once state is updated everywhere.
    setInterval(this.tick, 3000);
  }
  fetchState = () => {
    ddevShell
      .list()
      .then(data => {
        // console.log(data);
        this.loadProjects(data);
      })
      .catch(e => {
        // console.log(e);
        this.addError(e);
      });
  };
  loadProjects = newProjects => {
    // 1. Take a copy of the existing state
    let projects = { ...this.state.projects };
    // 2. Add our new projects to that projects variable
    projects = newProjects;
    // 3. Set the new projects object to state
    this.setState({ projects });
  };
  tick = () => {
    this.fetchState();
  };
  addError = error => {
    // 1. Take a copy of the existing state
    const errors = { ...this.state.errors };
    // 2. Add our new error to that errors variable
    const newError = JSON.parse(error);
    newError.type = getErrorResponseType(newError);
    if (!isObject(errors[newError.type])) {
      errors[newError.type] = {};
    }
    errors[newError.type][Date.now()] = newError;
    // 3. Set the new errors object to state
    this.setState({ errors });
  };
  render() {
    return (
      <Window chrome padding="0px" className="Window">
        <div className="wrap">
          <Header />
          <section className="Main">
            <Sidebar projects={this.state.projects} />
            <main className="Content">
              <Alerts errors={this.state.errors} />
              <Container
                projects={this.state.projects}
                errors={this.state.errors}
              />
            </main>
          </section>
          <Footer />
        </div>
      </Window>
    );
  }
}

export default App;

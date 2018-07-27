import React from "react";
import { Window } from "react-desktop/macOs";
import { isObject } from "util";
import "popper.js";
import "bootstrap";
window.$ = window.jQuery = require("jquery");

// components
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import ViewRouter from "./ViewRouter";
import Alerts from "./Alerts";

// non componentized JS
import { init } from "./../modules/ui";
import ddevShell from "../modules/ddev-shell";
import { getErrorResponseType } from "./../modules/helpers";

// app styling
import "~/src/resources/scss/main.scss";

class Dashboard extends React.Component {
  state = {
    projects: {},
    errors: {}
  };
  componentDidMount() {
    // TODO: Remove this once everything is moved over
    init();
    // Initial state load
    this.fetchProjects();
    // TODO: this could be reduced/removed once state is updated everywhere.
    this.timerID = setInterval(() => this.heartBeat(), 1000);
  }
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  fetchProjects = () => {
    ddevShell
      .list()
      .then(newProjects => {
        let projects = {};
        for (var key in newProjects) {
          if (newProjects.hasOwnProperty(key)) {
            projects[newProjects[key].name] = newProjects[key];
          }
        }
        this.updateProjects(projects);
      })
      .catch(e => {
        console.log(e);
        this.addError(e);
      });
  };
  updateProjects = projects => {
    if (JSON.stringify(this.state.projects) !== JSON.stringify(projects)) {
      this.setState({ projects });
    }
  };
  heartBeat = () => {
    this.fetchProjects();
  };
  addError = error => {
    // 1. Take a copy of the existing state
    let errors = { ...this.state.errors };
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
            <main className="Content container-fluid">
              <Alerts errors={this.state.errors} />
              <ViewRouter
                addError={this.addError}
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

export default Dashboard;

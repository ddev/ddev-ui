import React from 'react';
import { Window } from 'react-desktop/macOs';
import _ from 'lodash';
import { toast } from 'react-toastify';
import ErrorBoundary from 'react-error-boundary';
import { Container, Row, Col } from 'reactstrap';
import SplitPane from 'react-split-pane';
import ElementQueries from 'css-element-queries/src/ElementQueries';

import { updateDistros } from 'distro-updater';
import { list } from 'ddev-shell';
import { isJson } from 'helpers';

// components
import Header from 'Components/Header';
import Sidebar from 'Components/Sidebar';
import Alpha from 'Components/Alpha';
import Alerts from 'Components/Alerts';
import Status from 'Components/Status';
import ViewRouter from 'Components/ViewRouter';

ElementQueries.listen();

class Dashboard extends React.Component {
  state = {
    projects: {},
    errors: {},
  };

  componentDidMount() {
    // update the CMS distros
    updateDistros();
    // Initial state load
    this.fetchProjects();
    // Set heartbeat to check for updates
    // TODO: Work with local team to refine `ddev list -j --continuous` and start using that instead
    this.timerID = setInterval(() => this.heartBeat(), 2500); // 2.5s
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  fetchProjects = () => {
    list()
      .then(newProjects => {
        const projects = !_.isEmpty(newProjects) ? _.mapKeys(newProjects, value => value.name) : {};
        this.updateProjects(projects);
        this.errorResolve();
      })
      .catch(e => {
        this.errorCapture(e);
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

  errorCapture = (e, details) => {
    let error = {};
    if (isJson(e)) {
      error = JSON.parse(e);
    } else if (_.isString(e)) {
      error.msg = e;
    } else if (_.isError(e)) {
      error.msg = e.message;
    }

    const {
      msg = 'There was a problem!',
      level = 'info',
      type = 'general',
      info = _.isError(e) ? e.stack : details || null,
      time = Date.now(),
      id = Date.now(),
    } = error;

    // Docker error
    if (_.isString(msg) && msg.includes('Docker')) {
      this.props.triggerChecks();
    }

    if (_.isUndefined(_.find(this.state.errors, ['id', id]))) {
      // set to state to check against
      this.setState(prevState => {
        const { errors } = prevState;

        if (_.isUndefined(_.find(errors, id))) {
          // console.log(errors);
          errors[id] = { msg, info, id, level, type, time };

          // log error for now
          console.table({ msg, info, id, level, type, time });

          // update state
          return { errors };
        }
      });
    }
  };

  errorResolve = () => {
    if (_.find(this.state.errors, e => e.id === 'docker')) {
      this.setState(prevState => {
        const { errors } = prevState;
        const nonDockerErrors = _.find(errors, e => e.id !== 'docker');
        if (toast.isActive('docker')) {
          toast.dismiss('docker');
        }
        if (_.isUndefined(nonDockerErrors)) {
          return { errors: {} };
        }
        return { errors: nonDockerErrors };
      });
    }
  };

  errorRemove = id => {
    if (_.find(this.state.errors, e => !_.isUndefined(e) && !_.isUndefined(e.id) && e.id === id)) {
      this.setState(prevState => {
        const { errors } = prevState;
        const otherErrors = _.find(errors, e => e.id !== id);
        if (_.isUndefined(otherErrors)) {
          return { errors: {} };
        }
        return { errors: otherErrors };
      });
    }
  };

  render() {
    return (
      <ErrorBoundary onError={this.errorCapture}>
        <Container fluid className="app-container">
          <Row className="h-100">
            <Header />
            <Col>
              <SplitPane split="vertical" minSize={260} maxSize={700} defaultSize={300}>
                <Sidebar className="projectSidebar p-0 h-100" projects={this.state.projects} />
                <Col className="content h-100">
                  <Container fluid className="main h-100">
                    <Row>
                      <Status />
                      <Alpha />
                      <Alerts errorRemove={this.errorRemove} errors={this.state.errors} />
                      <ViewRouter
                        addError={this.addError}
                        projects={this.state.projects}
                        errors={this.state.errors}
                      />
                    </Row>
                  </Container>
                </Col>
              </SplitPane>
            </Col>
          </Row>
        </Container>
      </ErrorBoundary>
    );
  }
}

export default Dashboard;

import React from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import classnames from 'classnames';

import SingleClickApps from './SingleClickApps';
import CleanContainer from './CleanContainer';
import ConnectContainer from './ConnectContainer';

class CreateProject extends React.PureComponent {
  state = {
    name: '',
    installtype: 'existing',
    path: '',
    docroot: '',
    containerType: 'default',
    phpVersion: '7.1',
    webServer: 'nginx',
    dbType: 'MariaDB',
    enableXDebug: false,
    httpPort: 80,
    httpsPort: 443,
    cmsType: 'wordpress',
    cmsVersion: 'latest',
    activeTab: '1',
  };

  toggle = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  };

  render() {
    return (
      <div className="create-project">
        <h1 className="mt-1 mb-4">Create a new project</h1>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => {
                this.toggle('1');
              }}
            >
              One-Click App
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => {
                this.toggle('2');
              }}
            >
              Clean PHP Container
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '3' })}
              onClick={() => {
                this.toggle('3');
              }}
            >
              Connect Existing
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
                <SingleClickApps />
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col sm="12">
                <CleanContainer />
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="3">
            <Row>
              <Col sm="12">
                <ConnectContainer {...this.state} />
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </div>
    );
  }
}

export default CreateProject;

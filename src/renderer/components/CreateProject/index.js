import React from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import classnames from 'classnames';

import InstallProfiles from './InstallProfiles';
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
    activeTab: 'installProfiles',
  };

  // toggle the ui tab
  toggleTab = tab => {
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
              className={classnames({ active: this.state.activeTab === 'installProfiles' })}
              onClick={() => {
                this.toggleTab('installProfiles');
              }}
            >
              Install Profiles
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === 'clean' })}
              onClick={() => {
                this.toggleTab('clean');
              }}
            >
              Clean PHP Container
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === 'existing' })}
              onClick={() => {
                this.toggleTab('existing');
              }}
            >
              Connect Existing
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="installProfiles">
            <Row>
              <Col sm="12">
                <InstallProfiles />
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="clean">
            <Row>
              <Col sm="12">
                <CleanContainer />
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="existing">
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

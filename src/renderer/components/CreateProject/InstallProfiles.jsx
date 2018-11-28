import React, { Component } from 'react';
import { Container, Row } from 'reactstrap';
import supported from 'Resources/supported.yaml';

import FormProjectInfo from './FormProjectInfo';
import InstallProfile from './InstallProfile';

export default class InstallProfiles extends Component {
  state = {
    installType: false,
    installVersion: 'latest',
  };

  setInstallType = (type, version = this.state.installVersion) => {
    if (this.state.installType !== type) {
      this.setState({
        installType: type,
      });
    }
    if (this.state.installVersion !== version) {
      this.setState({
        installVersion: version,
      });
    }
  };

  render() {
    const { projectTypes } = supported;
    return this.state.installType ? (
      <FormProjectInfo type={this.state.installType} />
    ) : (
      <Container fluid>
        <Row className="py-4">
          {Object.keys(projectTypes).map(type => (
            <InstallProfile
              key={`app_${type}`}
              slug={type}
              title={projectTypes[type].name}
              style={{ backgroundColor: projectTypes[type].color }}
              logo={projectTypes[type].logo}
              versions={projectTypes[type].versions}
              installType={this.state.installType}
              setInstallType={this.setInstallType}
            >
              {projectTypes[type].summary}
            </InstallProfile>
          ))}
        </Row>
      </Container>
    );
  }
}

import React, { Component } from 'react';
import { Container, Row } from 'reactstrap';
import profiles from 'Resources/InstallProfiles.yaml';

import FormProjectInfo from './FormProjectInfo';
import InstallProfile from './InstallProfile';

export default class InstallProfiles extends Component {
  render() {
    const { projectTypes } = profiles;
    return this.props.cmsType !== 'none' ? (
      <FormProjectInfo {...this.props} />
    ) : (
      <Container fluid>
        <Row className="py-4">
          {Object.keys(projectTypes).map(type => {
            if (type !== 'none') {
              return (
                <InstallProfile
                  key={`app_${type}`}
                  slug={type}
                  title={projectTypes[type].name}
                  style={{ backgroundColor: projectTypes[type].color }}
                  logo={projectTypes[type].logo}
                  versions={projectTypes[type].versions}
                  support={projectTypes[type].support}
                  cmsType={this.props.cmsType}
                  cmsVersion={this.props.cmsVersion}
                  setInstallType={this.setInstallType}
                  handleInputChange={this.props.handleInputChange}
                  handleInstallProfileUpdate={this.props.handleInstallProfileUpdate}
                >
                  {projectTypes[type].summary}
                </InstallProfile>
              );
            }
            return null;
          })}
        </Row>
      </Container>
    );
  }
}

import React, { Component } from 'react';
import { Card, CardBody, CardFooter, Form, FormGroup, Container, Row, Col } from 'reactstrap';

import profiles from 'Resources/InstallProfiles.yaml';

import Name from './fields/Name';
import Paths from './fields/Paths';
import AdvancedOptions from './AdvancedOptions';
import ContainerOptions from './ContainerOptions';

export default class FormProjectInfo extends Component {
  render() {
    const { projectTypes } = profiles;
    const { title = '', logo = 'server.svg', color = '#8892BF' } = projectTypes[this.props.cmsType];

    // eslint-disable-next-line global-require,import/no-dynamic-require
    const img = require(`Media/${logo}`);
    return (
      <Container fluid>
        <Row>
          <Col className="mb-4">
            <Card id="connect-project" className="container-setup my-4">
              <Row noGutters>
                {this.props.installtype !== 'existing' && (
                  <Col
                    xs={{ size: 'auto' }}
                    className="text-center rounded-left p-3"
                    style={{ backgroundColor: color }}
                  >
                    <img src={img} alt={title} style={{ maxWidth: '40px' }} />
                  </Col>
                )}
                <Col>
                  <Form onSubmit={this.props.handleProjectCreation}>
                    <CardBody>
                      <FormGroup row>
                        <Col>
                          {this.props.installtype === 'existing' ? (
                            <div>
                              <Paths {...this.props} />
                              <Name {...this.props} />
                            </div>
                          ) : (
                            <div>
                              <Name {...this.props} />
                              <Paths {...this.props} />
                            </div>
                          )}
                          <AdvancedOptions {...this.props} />
                        </Col>
                      </FormGroup>
                    </CardBody>
                    <CardFooter className="small p-0">
                      <ContainerOptions {...this.props} />
                    </CardFooter>
                  </Form>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

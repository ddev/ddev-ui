import React, { Component } from 'react';
import { Card, CardBody, CardFooter, Form, FormGroup, Container, Row, Col } from 'reactstrap';

import * as phpLogo from 'Media/PHPLogo.png';
import Name from './fields/Name';
import Paths from './fields/Paths';
import AdvancedOptions from './AdvancedOptions';
import ContainerOptions from './ContainerOptions';

export default class FormProjectInfo extends Component {
  render() {
    return (
      <Container fluid>
        <Row>
          <Col className="mb-4">
            <Card id="connect-project" className="container-setup my-4">
              <Row noGutters>
                <Col
                  xs={{ size: 'auto' }}
                  className="bg-primary text-white text-center rounded-left p-3"
                >
                  <img
                    src={phpLogo}
                    alt="PHP Application"
                    className="text-white"
                    style={{ maxWidth: '40px' }}
                  />
                </Col>
                <Col>
                  <Form onSubmit={this.handleProjectCreation}>
                    <CardBody>
                      <FormGroup row>
                        <Col>
                          <Name {...this.props} />
                          <Paths {...this.props} />
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

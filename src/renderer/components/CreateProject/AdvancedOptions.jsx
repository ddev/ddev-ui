import React, { Component } from 'react';
import { Collapse, FormGroup, Label, Input, Row, Col } from 'reactstrap';

export default class AdvancedOptions extends Component {
  state = { collapse: false };

  toggle = e => {
    e.preventDefault();
    this.setState({ collapse: !this.state.collapse });
  };

  render() {
    return (
      <div className="clearfix">
        <p className="text-center mt-3">
          <a onClick={this.toggle} href="#!">
            Advanced Options{' '}
            {this.state.collapse ? (
              <i className="fa fa-chevron-up" aria-hidden="true" />
            ) : (
              <i className="fa fa-chevron-down" aria-hidden="true" />
            )}
          </a>
        </p>
        <Collapse isOpen={this.state.collapse}>
          <Row form>
            <Col className="form-inline text-center">
              <FormGroup className="mx-auto">
                <Label for="enableXDebug" className="mr-1" check>
                  Enable XDebug:
                </Label>
                <Input type="checkbox" id="enableXDebug" name="enableXDebug" />
              </FormGroup>
            </Col>
            <Col className="">
              <Row form className="align-items-center">
                <Col xs="auto">Ports:</Col>
                <Col>
                  <Row form>
                    <Col>
                      <FormGroup className="mx-auto">
                        <Label for="httpPort" className="mb-0 pt-0" size="sm">
                          HTTP:
                        </Label>
                        <Input
                          type="number"
                          size="sm"
                          bsSize="sm"
                          placeholder="80"
                          maxLength="3"
                          id="httpPort"
                          name="httpPort"
                          // onChange={this.props.handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup className="mx-auto">
                        <Label for="httpsPort" className="mb-0  pt-0" size="sm">
                          HTTPS:
                        </Label>
                        <Input
                          type="number"
                          size="sm"
                          bsSize="sm"
                          placeholder="443"
                          id="httpsPort"
                          name="httpsPort"
                          maxLength="3"
                          // onChange={this.props.handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </Collapse>
      </div>
    );
  }
}

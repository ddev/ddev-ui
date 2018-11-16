import React, { Component } from 'react';
import { Label, Input, FormGroup, Button, Row, Col } from 'reactstrap';

const supported = {
  servers: { nginx: 'nGinx', apache: 'Apache' },
  phpVersions: [7.2, 7.1, 5.6],
  wpVersions: [5.0, 4.9, 4.8],
  drupalVersions: [8, 7, 6],
};

export default class ContainerOptions extends Component {
  render() {
    return (
      <div id="ContainerOptions small">
        <Row form noGutters>
          <Col className="form-inline text-center">
            <FormGroup className="mx-auto">
              <Label for="webServer" className="mr-1" size="sm">
                Web Server:{' '}
              </Label>
              <Input type="select" id="webServer" name="webServer" bsSize="sm">
                {Object.keys(supported.servers).map(key => (
                  <option key={key} value={key}>
                    {supported.servers[key]}
                  </option>
                ))}
              </Input>
            </FormGroup>
          </Col>

          {supported.phpVersions && (
            <Col className="form-inline text-center">
              <FormGroup className="mx-auto">
                <Label for="phpVersion" className="mr-1" size="sm">
                  PHP Version:{' '}
                </Label>
                <Input type="select" name="phpVersion" id="phpVersion" bsSize="sm">
                  {supported.phpVersions.map(key => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          )}

          {false && // TODO: add check for cms
            supported.wpVersions && (
              <Col className="form-inline text-center">
                <FormGroup className="mx-auto">
                  <Label for="phpVersion" className="mr-1" size="sm">
                    WP Version:{' '}
                  </Label>
                  <Input type="select" name="phpVersion" id="phpVersion" bsSize="sm">
                    {supported.wpVersions.map(key => (
                      <option key={key} value={key}>
                        {key}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            )}

          <Col xs="auto" className="form-inline text-right">
            {!this.props.children ? (
              <Button color="primary" onClick={this.props.handleNextStep} className="rounded-0">
                {this.props.btnTxt ? this.props.btnTxt : 'Connect'}
              </Button>
            ) : (
              this.props.children
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

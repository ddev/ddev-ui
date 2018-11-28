import React, { Component } from 'react';
import { Label, Input, FormGroup, Button, Row, Col } from 'reactstrap';
import supported from 'Resources/supported.yaml';

export default class ContainerOptions extends Component {
  render() {
    return (
      <div id="ContainerOptions small">
        <Row form noGutters>
          <Col className="p-2">
            <FormGroup className="mx-auto mb-0 d-flex align-items-center flex-column flex-xl-row">
              <Label for="webServer" className="mr-1 mb-0 p-0 pl-1 col-xl-auto" size="sm">
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

          {supported.php && (
            <Col className="p-2">
              <FormGroup className="mx-auto mb-0 d-flex align-items-center flex-column flex-xl-row">
                <Label for="phpVersion" className="mr-1 mb-0 p-0 pl-1 col-xl-auto" size="sm">
                  PHP Version:{' '}
                </Label>
                <Input type="select" name="phpVersion" id="phpVersion" bsSize="sm">
                  {supported.php.map(key => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          )}

          {false && // TODO: add check for cms
            supported.projectTypes.wordpress.versions && (
              <Col className="p-2">
                <FormGroup className="mx-auto mb-0 d-flex align-items-center flex-column flex-xl-row">
                  <Label for="phpVersion" className="mr-1 mb-0 p-0 pl-1 col-xl-auto" size="sm">
                    WP Version:{' '}
                  </Label>
                  <Input type="select" name="phpVersion" id="phpVersion" bsSize="sm">
                    {supported.projectTypes.wordpress.versions.map(key => (
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
              <Button
                color="primary"
                onClick={this.props.handleNextStep}
                className="h-100 rounded-0 px-3"
              >
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

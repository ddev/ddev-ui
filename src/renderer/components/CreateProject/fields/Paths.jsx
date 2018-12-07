import React, { Component } from 'react';
import {
  FormGroup,
  FormText,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  Label,
  Input,
  Row,
  Col,
} from 'reactstrap';

export default class Paths extends Component {
  render() {
    return (
      <Row className="project-paths">
        <Col className="localPath">
          <FormGroup>
            {this.props.installtype === 'new' ? (
              <Label for="localPath">Select Install Path</Label>
            ) : (
              <Label for="localPath">Select Path to Install</Label>
            )}
            <InputGroup
              onClick={this.props.handlePathSetting}
              onKeyPress={this.props.handlePathSetting}
              role="button"
              tabIndex="0"
            >
              <Input
                id="localPath"
                name="localPath"
                type="text"
                readOnly
                required="required"
                className="form-control disabled"
                value={this.props.path}
              />
              <InputGroupAddon addonType="append">
                <InputGroupText>
                  <i className="fa fa-folder-open-o" aria-hidden="true" />
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <FormText color="muted">
              {this.props.installtype === 'new'
                ? 'Select the directory where you would like your new project installed.'
                : "Select the directory that contains your project's files."}
            </FormText>
          </FormGroup>
        </Col>
        {this.props.installtype === 'existing' && (
          <Col className="localDocroot">
            <FormGroup>
              <Label for="localDocroot">Select Project Docroot</Label>
              <InputGroup
                onClick={this.props.handleDocrootSetting}
                onKeyPress={this.props.handleDocrootSetting}
                role="button"
                tabIndex="0"
              >
                <Input
                  id="localDocroot"
                  name="localDocroot"
                  type="text"
                  readOnly
                  required="required"
                  className="form-control disabled"
                  value={this.props.docroot}
                />
                <InputGroupAddon addonType="append">
                  <InputGroupText>
                    <i className="fa fa-folder-open-o" aria-hidden="true" />
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <FormText color="muted">
                Select the projects's webroot if it's different from the project root.
              </FormText>
            </FormGroup>
          </Col>
        )}
      </Row>
    );
  }
}

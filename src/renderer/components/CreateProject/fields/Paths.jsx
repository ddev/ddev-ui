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
      <Row>
        <Col xs={12} md={this.props.installtype === 'new' ? 12 : 6}>
          <FormGroup>
            <Label for="localPath">Local Path</Label>
            <InputGroup
              onClick={this.props.handlePathSetting}
              onKeyPress={this.props.handlePathSetting}
              role="button"
              tabIndex="0"
            >
              <Input
                id="localPath"
                // name="path"
                name="localPath"
                maxLength="100"
                type="text"
                // disabled="disabled"
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
          <Col xs={12} md={6}>
            <FormGroup>
              <Label for="localDocroot">Project Docroot</Label>
              <InputGroup
                onClick={this.props.handleDocrootSetting}
                onKeyPress={this.props.handleDocrootSetting}
                role="button"
                tabIndex="0"
              >
                <Input
                  id="localDocroot"
                  // name="path"
                  name="localDocroot"
                  maxLength="100"
                  type="text"
                  // disabled="disabled"
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
                Select the directory from which your site is served. You may skip this field if your
                site files are in the project root.
              </FormText>
            </FormGroup>
          </Col>
        )}
      </Row>
    );
  }
}

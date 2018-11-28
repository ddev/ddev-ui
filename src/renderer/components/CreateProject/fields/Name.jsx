import React from 'react';
import { FormGroup, FormText, Label, Input, Row, Col } from 'reactstrap';

const Name = props => (
  <Row>
    <Col>
      <FormGroup>
        <Label for="projectName" />
        <Input
          maxLength="200"
          type="text"
          required="required"
          className="form-control form-control-lg"
          placeholder="my-new-project"
          value={props.projectName}
          name="name"
          id="projectName"
          // onChange={props.handleInputChange}
        />
        <FormText color="muted">
          Name or Domain of your project. (In a url friendly format.)
        </FormText>
        <FormText color="muted">
          <b>Local URL: </b>
          <span className="text-primary" key="projectNameExample">{`${
            props.projectName ? props.projectName : 'my-new-project'
          }.ddev.local`}</span>
        </FormText>
      </FormGroup>
    </Col>
  </Row>
);

export default Name;

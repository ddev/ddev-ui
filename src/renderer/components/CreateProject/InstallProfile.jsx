import React from 'react';
import {
  Row,
  Col,
  Card,
  CardTitle,
  CardBody,
  CardText,
  CardFooter,
  FormGroup,
  Label,
  Input,
  Button,
} from 'reactstrap';

const InstallProfile = props => {
  const { slug, title, logo = 'server.svg', style = {}, versions = [] } = props;

  // eslint-disable-next-line global-require,import/no-dynamic-require
  const img = require(`Media/${logo}`);

  return (
    <Col xs={12} lg={6} xl={4} className="mb-4">
      <Card className={`h-100 ${props.support !== 'full' ? 'coming-soon' : null}`}>
        <Row noGutters className="h-100">
          <Col xs={{ size: 'auto' }} className="rounded-left p-3 text-center" style={style}>
            <img src={img} alt={title} className="img-fluid" style={{ maxWidth: '40px' }} />
          </Col>
          <Col className="pb-5">
            <CardBody className="pb-2">
              <CardTitle>{title}</CardTitle>
              <CardText className="card-text small">{props.children}</CardText>
            </CardBody>
            <CardFooter className="p-0 fixed-bottom position-absolute">
              <Row form noGutters>
                <Col className="p-2">
                  <FormGroup className="mx-auto mb-0 d-flex align-items-center flex-column flex-xl-row">
                    <Label for="cmsVersion" className="d-none" size="sm">
                      Select
                    </Label>
                    <Input
                      name="cmsVersion"
                      id="cmsVersion"
                      type="select"
                      bsSize="sm"
                      value={props.cmsVersion}
                      onChange={props.handleInputChange}
                    >
                      <option value="latest">Latest Version</option>
                      {versions.map(version => (
                        <option key={`${title}_${version}`} value={version}>
                          {version}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
                <Col xs="auto" className="form-inline text-right">
                  <Button
                    color="primary"
                    className="h-100 rounded-0 px-3"
                    onClick={e => {
                      e.preventDefault();
                      props.handleInstallProfileUpdate(slug, props.cmsVersion);
                    }}
                  >
                    {props.btnTxt ? props.btnTxt : 'Create'}
                  </Button>
                </Col>
              </Row>
            </CardFooter>
          </Col>
        </Row>
      </Card>
    </Col>
  );
};

export default InstallProfile;

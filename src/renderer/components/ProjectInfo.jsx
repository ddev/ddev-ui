import React from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import classnames from 'classnames';

// define the ProjectTabItem sub-component
const ProjectTabItem = props => (
  <li className="list-group-item row d-flex">
    <dt className="col-sm-3 selectable-text">{props.title}</dt>
    <dd className="col-sm-9 selectable-text">{props.value}</dd>
  </li>
);

class ProjectInfo extends React.PureComponent {
  state = {
    activeTab: '1',
  };

  toggle = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  };

  render() {
    return (
      <div className="tabs">
        <Nav tabs>
          {/* Project Details */}
          {this.props.name && (
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === '1' })}
                onClick={() => {
                  this.toggle('1');
                }}
              >
                Project Details
              </NavLink>
            </NavItem>
          )}

          {/* Database */}
          {this.props.dbinfo && (
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === '2' })}
                onClick={() => {
                  this.toggle('2');
                }}
              >
                Database
              </NavLink>
            </NavItem>
          )}

          {/* config */}
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '3' })}
              onClick={() => {
                this.toggle('3');
              }}
            >
              Config
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={this.state.activeTab}>
          {/* Details */}
          {this.props.name && (
            <TabPane tabId="1">
              <Row>
                <Col sm="12">
                  <dl className="list-group list-group-flush">
                    <ProjectTabItem title="Name" value={this.props.name} />
                    <ProjectTabItem title="Root" value={this.props.approot} />
                    <ProjectTabItem title="URL" value={this.props.httpurl} />
                    <ProjectTabItem title="PHP Version" value={this.props.php_version} />
                    <ProjectTabItem title="Status" value={this.props.status} />
                    <ProjectTabItem title="Install Type" value={this.props.type} />
                  </dl>
                </Col>
              </Row>
            </TabPane>
          )}

          {/* Database */}
          {this.props.dbinfo && (
            <TabPane tabId="2">
              <Row>
                <Col sm="12">
                  <dl className="list-group list-group-flush">
                    <ProjectTabItem title="DB Name" value={this.props.dbinfo.dbname} />
                    <ProjectTabItem title="DB Username" value={this.props.dbinfo.username} />
                    <ProjectTabItem title="DB Host" value={this.props.dbinfo.host} />
                    <ProjectTabItem title="DB Password" value={this.props.dbinfo.password} />
                    <ProjectTabItem title="DB Port" value={this.props.dbinfo.port} />
                    <ProjectTabItem
                      title="DB Published Port"
                      value={this.props.dbinfo.published_port}
                    />
                  </dl>
                </Col>
              </Row>
            </TabPane>
          )}

          {/* config */}
          <TabPane tabId="3">
            <Row>
              <Col sm="12">
                <dl className="list-group list-group-flush">
                  <ProjectTabItem
                    title="WIP"
                    value="This will pull in the config settings from the CLI or reading the config.yml"
                  />
                </dl>
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </div>
    );
  }
}

export default ProjectInfo;

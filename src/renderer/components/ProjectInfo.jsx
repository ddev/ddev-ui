import React from 'react';

// define the ProjectTab sub-component
const ProjectTab = props => (
  <li className="nav-item">
    <a
      className={`nav-link ${props.status ? props.status : ''}`}
      id={`${props.id}-tab`}
      data-toggle="tab"
      href={`#${props.id}`}
      role="tab"
      aria-controls={props.id}
      aria-selected="true"
    >
      {props.title}
    </a>
  </li>
);

// define the ProjectTabItem sub-component
const ProjectTabItem = props => (
  <li className="list-group-item row d-flex">
    <dt className="col-sm-3 selectable-text">{props.title}</dt>
    <dd className="col-sm-9 selectable-text">{props.value}</dd>
  </li>
);

class ProjectInfo extends React.PureComponent {
  render() {
    return (
      <div className="tabs">
        <ul className="nav nav-tabs" id="myTab" role="tablist">
          {/* Project Details */}
          {this.props.name ? (
            <ProjectTab title="Project Details" id="site-details" status="active" />
          ) : null}
          {/* Database */}
          {this.props.dbinfo ? <ProjectTab title="Database" id="site-db" /> : null}
          {/* config */}
          <ProjectTab title="Config" id="config" />
        </ul>
        <div className="tab-content" id="myTabContent">
          {/* Details */}
          {this.props.name ? (
            <div
              className="tab-pane fade show active"
              id="site-details"
              role="tabpanel"
              aria-labelledby="site-details-tab"
            >
              <dl className="list-group list-group-flush">
                <ProjectTabItem title="Name" value={this.props.name} />
                <ProjectTabItem title="Root" value={this.props.approot} />
                <ProjectTabItem title="URL" value={this.props.httpurl} />
                <ProjectTabItem title="PHP Version" value={this.props.php_version} />
                <ProjectTabItem title="Status" value={this.props.status} />
                <ProjectTabItem title="Install Type" value={this.props.type} />
              </dl>
            </div>
          ) : null}
          {/* Database */}
          {this.props.dbinfo ? (
            <div
              className="tab-pane fade"
              id="site-db"
              role="tabpanel"
              aria-labelledby="site-db-tab"
            >
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
            </div>
          ) : null}
          {/* config */}
          <div className="tab-pane fade" id="config" role="tabpanel" aria-labelledby="config-tab">
            <dl className="list-group list-group-flush">
              <ProjectTabItem
                title="WIP"
                value="This will pull in the config settings from the CLI or reading the config.yml"
              />
            </dl>
          </div>
        </div>
      </div>
    );
  }
}

export default ProjectInfo;

import React from 'react';
import AddProjectCard from '../../components/AddProjectCard/';
import ProjectCard from '../../components/ProjectCard';

class Dashboard extends React.Component {
  render() {
    const sites = [{"approot":"/Users/atran/Desktop/d7sudorun2","dbinfo":{"dbname":"db","host":"db","password":"db","port":"3306","published_port":"32770","username":"db"},"httpsurl":"https://d7sudorun2.ddev.local","httpurl":"http://d7sudorun2.ddev.local","mailhog_url":"http://d7sudorun2.ddev.local:8025","name":"d7sudorun2","php_version":"7.1","phpmyadmin_url":"http://d7sudorun2.ddev.local:8036","router_http_port":"80","router_https_port":"443","router_status":"healthy","shortroot":"~/Desktop/d7sudorun2","status":"running","type":"drupal7"},{"approot":"/Users/atran/Desktop/d7finaltest","dbinfo":{"dbname":"db","host":"db","password":"db","port":"3306","published_port":"32776","username":"db"},"httpsurl":"https://d7finaltest.ddev.local","httpurl":"http://d7finaltest.ddev.local","mailhog_url":"http://d7finaltest.ddev.local:8025","name":"d7finaltest","php_version":"7.1","phpmyadmin_url":"http://d7finaltest.ddev.local:8036","router_http_port":"80","router_https_port":"443","router_status":"healthy","shortroot":"~/Desktop/d7finaltest","status":"running","type":"drupal7"},{"approot":"/Users/atran/Downloads/badd8","httpsurl":"https://badd8.ddev.local:","httpurl":"http://badd8.ddev.local:","name":"badd8","php_version":"7.1","router_http_port":"","router_https_port":"","router_status":"healthy","shortroot":"~/Downloads/badd8","status":"web service stopped","type":"drupal8"}];
    return (
      <div>
        <div className="container-fluid">
          <div className="row card-container">
            <AddProjectCard />
            {sites.map(function(site){
              return <ProjectCard site={site} />;
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;


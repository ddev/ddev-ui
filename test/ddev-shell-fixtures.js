const validListOutput = `
1 local site found.
NAME        TYPE     LOCATION            URL                           STATUS          
fakedrupal  drupal7  ~/Downloads/drupal  http://fakedrupal.ddev.local  running
fakewordpress  wordpress  ~/Downloads/wordpress  http://wordpress.ddev.local  running

DDEV ROUTER STATUS: running
        
`;

const validDescribeJSON = {
    "level":"info",
    "msg":"NAME TYPE LOCATION URL STATUS \ndrupaltest drupal8 ~/Downloads/drupal http://drupaltest.ddev.local running\n\nMySQL Credentials\n-----------------\nUsername: \tdb \nPassword: \tdb \nDatabase name:\tdb \nHost: \tdb \nPort: \t3306\nTo connect to mysql from your host machine, use port 32768 on 127.0.0.1.\nFor example: mysql --host=127.0.0.1 --port=32768 --user=db --password=db --database=db\n\nOther Services\n--------------\nMailHog: \thttp://drupaltest.ddev.local:8025\nphpMyAdmin:\thttp://drupaltest.ddev.local:8036\n\nDDEV ROUTER STATUS: healthy",
    "raw":{
        "approot":"~/Downloads/drupal",
        "dbinfo":{
            "dbname":"db",
            "host":"db",
            "password":"db",
            "port":"3306",
            "published_port":"32768",
            "username":"db"
        },
        "mailhog_url":"http://drupaltest.ddev.local:8025",
        "name":"drupaltest",
        "phpmyadmin_url":"http://drupaltest.ddev.local:8036",
        "router_status":"healthy",
        "status":"running",
        "type":"drupal8",
        "url":"http://drupaltest.ddev.local"
    },
    "time":"2017-11-16T17:49:24-07:00"
};

const expectedSitesArray = [
    {
        name: 'fakedrupal',
        type: 'drupal7',
        path: '~/Downloads/drupal',
        url: 'http://fakedrupal.ddev.local',
        state: 'running'
    }, {
        name: 'fakewordpress',
        type: 'wordpress',
        path: '~/Downloads/wordpress',
        url: 'http://wordpress.ddev.local',
        state: 'running'
    }
];

const expectedDescribeObject = {"MySQL Credentials":{"dbname":"db","host":"db","password":"db","port":"3306","published_port":"32768","username":"db"},"Other Services":{"MailHog":"<a onclick=\"electron.shell.openExternal('http://drupaltest.ddev.local:8025')\" href=\"#\">http://drupaltest.ddev.local:8025</a>","phpMyAdmin":"<a onclick=\"electron.shell.openExternal('http://drupaltest.ddev.local:8036')\" href=\"#\">http://drupaltest.ddev.local:8036</a>"}};

const validStartOutput = "Successfully started drupaltest";
const invalidStartOutput = "Unable to start drupaltest";
const validStopOutput = "Application has been stopped.";
const invalidStopOutput = "Unable to stop drupaltest";
const validRestartOutput = "Successfully restarted drupaltest";
const invalidRestartOutput = "Unable to restart drupaltest";
const invalidDescribeOutput = "Unable to get site info";

module.exports.validListOutput = validListOutput;
module.exports.expectedSitesArray = expectedSitesArray;
module.exports.validStartOutput = validStartOutput;
module.exports.invalidStartOutput = invalidStartOutput;
module.exports.validStopOutput = validStopOutput;
module.exports.invalidStopOutput = invalidStopOutput;
module.exports.validRestartOutput = validRestartOutput;
module.exports.invalidRestartOutput = invalidRestartOutput;
module.exports.validDescribeJSON = validDescribeJSON;
module.exports.expectedDescribeObject = expectedDescribeObject;
module.exports.invalidDescribeOutput = invalidDescribeOutput;
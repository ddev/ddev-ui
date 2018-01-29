const validListOutput = {"level":"info","msg":"NAME        TYPE     LOCATION            URL(s)                        STATUS \ndrupaltest  drupal8  ~/Downloads/drupal  http://drupaltest.ddev.local  running\n\nDDEV ROUTER STATUS: healthy","raw":[{"approot":"/Users/fakeuser/Downloads/drupal","dbinfo":{"dbname":"db","host":"db","password":"db","port":"3306","published_port":"32772","username":"db"},"httpsurl":"","httpurl":"http://drupaltest.ddev.local","mailhog_url":"http://drupaltest.ddev.local:8025","name":"drupaltest","phpmyadmin_url":"http://drupaltest.ddev.local:8036","router_status":"healthy","shortroot":"~/Downloads/drupal","status":"running","type":"drupal8"}],"time":"2017-11-20T16:28:36-07:00"};
const validDescribeJSON = {"level":"info","msg":"NAME        TYPE     LOCATION            URL(s)                        STATUS \ndrupaltest  drupal8  ~/Downloads/drupal  http://drupaltest.ddev.local  running\n\nMySQL Credentials\n-----------------\nUsername:     \tdb  \nPassword:     \tdb  \nDatabase name:\tdb  \nHost:         \tdb  \nPort:         \t3306\nTo connect to mysql from your host machine, use port 32772 on 127.0.0.1.\nFor example: mysql --host=127.0.0.1 --port=32772 --user=db --password=db --database=db\n\nOther Services\n--------------\nMailHog:   \thttp://drupaltest.ddev.local:8025\nphpMyAdmin:\thttp://drupaltest.ddev.local:8036\n\nDDEV ROUTER STATUS: healthy","raw":{"approot":"/Users/fakeuser/Downloads/drupal","dbinfo":{"dbname":"db","host":"db","password":"db","port":"3306","published_port":"32772","username":"db"},"httpsurl":"","httpurl":"http://drupaltest.ddev.local","mailhog_url":"http://drupaltest.ddev.local:8025","name":"drupaltest","phpmyadmin_url":"http://drupaltest.ddev.local:8036","router_status":"healthy","shortroot":"~/Downloads/drupal","status":"running","type":"drupal8"},"time":"2017-11-20T16:32:42-07:00"};


const expectedSitesArray = [{"approot":"/Users/fakeuser/Downloads/drupal","dbinfo":{"dbname":"db","host":"db","password":"db","port":"3306","published_port":"32772","username":"db"},"httpsurl":"","httpurl":"http://drupaltest.ddev.local","mailhog_url":"http://drupaltest.ddev.local:8025","name":"drupaltest","phpmyadmin_url":"http://drupaltest.ddev.local:8036","router_status":"healthy","shortroot":"~/Downloads/drupal","status":"running","type":"drupal8"}];
const expectedDescribeObject = {"MySQL Credentials":{"dbname":"db","host":"db","password":"db","port":"3306","published_port":"32772","username":"db"},"Other Services":{"MailHog":"<a class='open-site' data-url='http://drupaltest.ddev.local:8025' href=\"#\">http://drupaltest.ddev.local:8025</a>","phpMyAdmin":"<a class='open-site' data-url='http://drupaltest.ddev.local:8036' href=\"#\">http://drupaltest.ddev.local:8036</a>"}};


const validStartOutput = "Successfully started drupaltest";
const invalidStartOutput = "Unable to start drupaltest";
const validStopOutput = "Application has been stopped.";
const invalidStopOutput = "Unable to stop drupaltest";
const validRestartOutput = "Successfully restarted drupaltest";
const invalidRestartOutput = "Unable to restart drupaltest";
const invalidDescribeOutput = "Unable to get site info";
const validRemoveOutput = "Successfully Removed Site";
const validRemoveDBOutput = "Successfully Removed Site and DB";
const invalidRemoveOutput = "Unable to remove site";

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
module.exports.validRemoveOutput = validRemoveOutput;
module.exports.validRemoveDBOutput = validRemoveDBOutput;
module.exports.invalidRemoveOutput = invalidRemoveOutput;

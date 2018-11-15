Feature: Work-in-progress dumping ground of DDEV local ui features

   This feature file is home to all ddev local ui features that have not yet had the Given/when/then steps fully caputred. Once steps have been fully captured, we will pull the scenarios out of this feature file and put them in a more descriptive one

Scenario: DDEV-UI requires and checks for an appropriate version of the command line
Given I have DDEV UI installed
And I have a compatible version of the command line installed
When I open up DDEV UI
Then the command line version check passes

Given I have DDEV UI installed
And I have an incompatible version of the command line installed
When I open up DDEV UI
Then the command line version check fails

Scenario: DDEV-UI requires and checks that Docker is running
Given I have DDEV UI installed
And Docker is running
When I open up DDEV UI
Then I can interact with DDEV UI

Given I have DDEV UI installed
And Docker is not running
When I open up DDEV UI
Then I see buttons to Retry and Install Docker

Scenario: Docker can be stopped or restarted and DDEV-UI will respond
Given I have DDEV UI opened
And Docker is running
When I stop Docker
Then DDEV UI will update and indicate Docker is no longer running

Scenario: DDEV UI will direct me to the correct GitHub location to submit feedback

Scenario: DDEV UI will direct me to the correct location for documentation

Scenario: DDEV UI will autoupdate when an update is available 

# Items below capture features not yet supported in the ui platform for local but we can still fill out the gherkin steps! 

# NOTES: we can start in UI but cant configure 
# Scenario: DDEV Desktop can configure and start Drupal 6, 7 and 8 projects
# Scenario: DDEV Desktop can configure and start WordPress projects
# Scenario: DDEV Desktop can configure and start Typo3 projects
# Scenario: DDEV Desktop can configure and start Backdrop projects
# Scenario: DDEV Desktop can configure and start PHP projects

# Scenario: DDEV Desktop can pull and start projects from backups in S3
# Scenario: PHP version can be changed in a DDEV project through the UI
# Scenario: I can get a list of current DDEV projects in the UI
# Scenario: I can remove a DDEV project in the UI
# Scenario: I can remove a DDEV project and all associated data through the UI
# Scenario: I can remove all DDEV projects from my machine through the UI
# Scenario: I can start, stop and restart a DDEV project through the UI
# Scenario: I can take a database snapshot of a DDEV project through the UI
# Scenario: I can restore from a database snapshot of a DDEV project through the UI
# Scenario: I can run a DDEV project with the NginX web server through the UI
# Scenario: I can run a DDEV project with the Apache web server through the UI
# Scenario: I can SSH into my project’s web container and issue commands through the UI
# Scenario: I can check the version of my DDEV Local install through the UI
# Scenario: I can create a blank Typo3 project
# Scenario: I can create a blank Backdrop project



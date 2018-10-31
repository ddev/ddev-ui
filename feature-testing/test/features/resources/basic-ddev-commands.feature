Feature: Basic DDEV Local Commands 

   Users should be able to execute basic DDEV Local commands from the app.

Background: 
    Given a user has the most recent version of DDEV UI
    And DDEV is installed
    And Docker is running    
    And the user has an existing project in DDEV Local

Scenario: Can start a DDEV project  
    When the user clicks the "Start" button
    Then the status is "running" 

Scenario: Can stop a DDEV project
    When the user clicks the "Stop" button
    Then the status is "stopped"

Scenario: Can restart a DDEV project
    And the user has a project running
    When the user clicks the "Restart" button
    ##TODO whats a good way to tell that the project has been restarted? 

Scenario: DDEV-UI lists all DDEV projects and their status

Scenario: I can setup a DDEV project from an existing project

Scenario: I can remove a DDEV project
Feature: Create a blank site

   A DDEV UI user should be able to create a blank WordPress, Drupal 6, Druapl 7, and Drupal 8 site via the UI using default configurations.

Scenario Outline: Create a blank project
    Given a user has the most recent version of DDEV UI
    And DDEV is installed
    And Docker is running 
    When the local path is set 
    And the user submits the form with <site-name>
    And submits the form with default settings enabled
    And submits the form with <site-type> selected
    ## Had to enter computer password
    Then the <site-name> site is created
    And the status is "running"

    Examples:
    | site-name      | site-type  |
    | blank-site-wp  | WordPress  |
    | blank-site-d6  | Drupal 6   |
    | blank-site-d7  | Druapl 7   |
    | blank-site-d8  | Druapl 8   |
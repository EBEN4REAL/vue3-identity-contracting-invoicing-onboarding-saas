Feature: Page Not Found

  Scenario: UI
    Given the User "002" is Signed In
    And the IAM User @me request has been intercepted to return the User "002"
    When the User navigates to "/nonexistenturl"
    Then the Element with Cypress ID "back-to-button" should be visible
    And the Element with selector "#title" should have the text as "404"
    And the Element with selector "[data-cy='message']" contains the text as "Sorry! This page cannot be found. Please go back to Home."
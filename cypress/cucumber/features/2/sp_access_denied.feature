Feature: SP Access Denied

  Scenario: With Params
    When the User navigates to "/sp-access-denied?sp_name=SPName&next_url=http%3A%2F%2Fexample.com"
    Then the Element with Cypress ID "message" contains the text as "You don't have the correct permissions to login to SPName"
    And the Element with Cypress ID "back-to-button" contains the text as "Back to SPName"

  Scenario: Without Params
    When the User navigates to "/sp-access-denied"
    Then the Element with Cypress ID "message" contains the text as "You don't have the correct permissions to login to Acme Inc."
    And the Element with Cypress ID "back-to-button" contains the text as "Back to Acme Inc."

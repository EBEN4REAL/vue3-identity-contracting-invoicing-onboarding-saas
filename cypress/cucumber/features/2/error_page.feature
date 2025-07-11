Feature: Error Page

  Scenario: Should be possible to go to error page with errorId value
    When the User navigates to "/error-page?error_id=550e8400-e29b-41d4-a716-446655440000"
    Then the Element with Cypress ID "page-not-found-title" contains the text as "Oops... looks like something went wrong on our end!"
    And the Element with Cypress ID "back-to-button" should be visible
    And the Element with Cypress ID "reference" should have the text as " Reference: 550e8400-e29b-41d4-a716-446655440000"

  Scenario: Without errorId value
    When the User navigates to "/error-page"
    Then the Element with Cypress ID "reference" should NOT exist
    When the User clicks on the Element with Cypress ID "button-contact-us"
    Then a new tab should open with URL "https://getveriam.com/contact"
    When the User clicks on the Element with Cypress ID "button-schedule-call"
    Then a new tab should open with URL "https://getveriam.com/meet/support-call"

  Scenario: Invalid Error ID
    When the User navigates to "/error-page?error_id=test"
    Then the Element with Cypress ID "page-not-found-title" contains the text as "Oops... looks like something went wrong on our end!"
    And the Element with Cypress ID "reference" should NOT exist
    And the Element with Cypress ID "button-contact-us" should be visible
    And the Element with Cypress ID "button-schedule-call" should be visible
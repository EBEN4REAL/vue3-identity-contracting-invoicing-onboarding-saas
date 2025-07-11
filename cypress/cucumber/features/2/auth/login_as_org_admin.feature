Feature: Login as Organization Admin

  Scenario: Successful Login as Support Partner

    Given the User "MMAdmin001" is Signed In
    And the IAM User @me request has been intercepted to return the User "MMAdmin001"
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization request has been intercepted to return the Organization "000" for SP "0edfc35c-e116-4c2e-8e35-8a28b68d5f6d"
    And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Element with Cypress ID "provide-support-nav-link" should be visible
    And the IAM Organizations request has been intercepted to return the Organizations "002"
    When the User clicks on the Element with Cypress ID "provide-support-nav-link"
    Then the User should be redirected to "/login/support"
    And the Element with Cypress ID "select-support-organization" should be visible
    When the User clicks on the Element with Cypress ID "select-support-organization"
    And the Element with Cypress ID "mm-autocomplete-option-8b2e7a85-a1d9-4f6c-b7e2-8d3f9c24e591" should be visible
    And the User clicks on the Element with Cypress ID "mm-autocomplete-option-8b2e7a85-a1d9-4f6c-b7e2-8d3f9c24e591"
    And the POST request for login to organization has been intercepted with id "8b2e7a85-a1d9-4f6c-b7e2-8d3f9c24e591"
    And the User "MMAdmin001-with-aao" is Signed In
    And the IAM User @me request has been intercepted to return the User "MMAdmin001-with-aao"
    And the IAM Organization request has been intercepted to return the Organization "002"
    And the User clicks on the Element with Cypress ID "continue"
    Then check that the user is currently logged in the organization dashboard with the id "8b2e7a85-a1d9-4f6c-b7e2-8d3f9c24e591"
    And the Element with Cypress ID "support-banner" should be visible
    
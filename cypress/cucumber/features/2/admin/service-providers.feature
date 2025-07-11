Feature: Admin - Service Providers

  Scenario: Unauthorized

    Given no User is Signed In
    And the IAM OAuth Authorize redirects to the Login page
    When the User navigates to "/sc/admin/service-providers"
    Then the User should be redirected to "/login"

  Scenario: Forbidden

    Given the User "002" is Signed In
    When the User navigates to "/sc/admin/service-providers"
    Then the Element with Cypress ID "service-providers-table" should NOT exist
    Then the Element with selector "#title" should have the text as "404"

  Scenario: Success

    Given the User "MMAdmin001" is Signed In
    And the IAM Service Providers request has been intercepted to return the Service Providers "001"
    When the User navigates to "/sc/admin/service-providers"
    Then the Element with Cypress ID "service-providers-table" should be visible

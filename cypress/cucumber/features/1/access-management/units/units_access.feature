Feature: Access Management - Units - Access

  Scenario: Unauthorized
    Given no User is Signed In
    And the IAM OAuth Authorize redirects to the Login page
    When the User navigates to "/sc/units"
    Then the User should be redirected to "/login"

  Scenario: Onboarding Uncompleted
    Given the User "001" is Signed In
    And the Onboarding Flow request has been intercepted to return the Flow "user_details_without_job_role"
    When the User navigates to "/sc/units"
    Then the User should be redirected to "/onboarding"

  Scenario: Forbidden with non-Org User
    Given the User "001OnboardingCompleted" is Signed In
    When the User navigates to "/sc/units"
    Then the Element with Cypress ID "organization-units-aside" should NOT exist

  Scenario: Success with Organization Admin from direct URL
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    When the User navigates to "/sc/units"
    Then the Element with Cypress ID "organization-units-aside" should exist

  Scenario: Success with Organization Admin from App Bar
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User clicks on the Element with selector "#app-navigation-access-units"
    When the User navigates to "/sc/units"
    Then the Element with Cypress ID "organization-units-aside" should exist

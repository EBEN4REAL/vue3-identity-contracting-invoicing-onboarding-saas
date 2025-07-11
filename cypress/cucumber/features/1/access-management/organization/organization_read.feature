Feature: Access Management - Organization

  Scenario: Unauthorized

    Given no User is Signed In
    And the IAM OAuth Authorize redirects to the Login page
    When the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    Then the User should be redirected to "/login"

  Scenario: Forbidden with non-Org User

    Given the User "001OnboardingCompleted" is Signed In
    When the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    Then the Element with selector "#organization-attributes" should NOT exist
    And the Element with selector "#title" should have the text as "404"

  Scenario: Success with Organization Viewer User from App Navigation

    Given the User "005" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User clicks on the Element with selector "#app-navigation-access-organization"
    When the User should be redirected to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    Then the Element with Cypress ID "organization-page-main" should exist

  Scenario: Success with Organization Viewer User from direct URL

    Given the User "005" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001-with-domains"
    And the IAM Organization units request has been intercepted to return the units of Organization "001-with-domains"
    When the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    Then the Element with Cypress ID "organization-page-main" should exist
    And the Element with Cypress ID "header-title" should have the text as "Org 001"
    And the Element with Cypress ID "organization-details-read org-name organization-detail-item-text" should have the text as "Org 001"
    And the Element with Cypress ID "organization-details-read domains organization-detail-item-text" should have the text as "example.com"

  Scenario: Forbidden with org id that doesn't exist

    Given the User "005" is Signed In
    And the IAM Organization request has been intercepted to return "404" for the Organization with ID "bf4f1b51-af7c-4e76-89c9-98e40a6b83ca"
    When the User navigates to "/sc/organizations/bf4f1b51-af7c-4e76-89c9-98e40a6b83ca"
    Then the Element with Cypress ID "header-title" should have the text as "Organization doesn't exist"

  Scenario: Forbidden with org that User has no access to

    Given the User "006" is Signed In
    And the IAM Organization request has been intercepted to return "403" for the Organization with ID "bf4f1b51-af7c-4e76-89c9-98e40a6b83ca"
    When the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    Then the Element with Cypress ID "header-title" should have the text as "Organization doesn't exist"

Feature: Onboarding - Portal switch

  Scenario: Should show switch with correct info if User is SP

    Given the User "005" is Signed In
    And the Onboarding Welcome Components GET request has been intercepted to retrieve User Onboarding Welcome Components with Fixture Id "002-first-step-completed" for "sc" app
    When the User navigates to "/sc/getting-started"
    Then the Element with Cypress ID "portal-switcher" should exist
    And the User clicks on the Element with Cypress ID "portal-switch-app-nav"
    Then the Element with Cypress ID "go-admin-portal" should exist
    Then the Element with Cypress ID "sc-org-message" should NOT be visible

  Scenario: Should show switch with correct info if User is SC Org

    Given the User "SCOrg" is Signed In
    And the Onboarding Welcome Components GET request has been intercepted to retrieve User Onboarding Welcome Components with Fixture Id "002-first-step-completed" for "sc" app
    When the User navigates to "/sc/getting-started"
    Then the Element with Cypress ID "portal-switcher" should exist
    And the User clicks on the Element with Cypress ID "portal-switch-app-nav"
    Then the Element with Cypress ID "go-admin-portal" should exist
    And the Element with Cypress ID "sc-org-message" should exist
    When the User clicks on the Element with Cypress ID "portal-switch-app-nav go-admin-portal"
    Then the User should be redirected to "sc-to-sp/8b2e7a85-a1d9-4f6c-b7e2-8d3f9c24e591"
    When the User clicks on the Element with Cypress ID "back-customer-portal"
    Then the User should be redirected to "/sc/getting-started"

  Scenario: Should be possible to register a SC Org as SP

    Given the User "SCOrg" is Signed In
    And the Onboarding Welcome Components GET request has been intercepted to retrieve User Onboarding Welcome Components with Fixture Id "002-first-step-completed" for "sc" app
    When the User navigates to "/sc/getting-started"
    Then the Element with Cypress ID "portal-switcher" should exist
    And the User clicks on the Element with Cypress ID "portal-switch-app-nav"
    When the User clicks on the Element with Cypress ID "portal-switch-app-nav go-admin-portal"
    And the IAM Organization request has been intercepted to register as a SP the Organization "8b2e7a85-a1d9-4f6c-b7e2-8d3f9c24e591"
    Then the User clicks on the Element with Cypress ID "continue"
    Then the User navigates to "/sp/getting-started"
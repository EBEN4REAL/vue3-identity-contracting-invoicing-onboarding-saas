Feature: Onboarding - User Welcome Component

  Scenario: Should redirect user to Getting Started page, Highlight Getting Started link as active if All Steps have not been completed, render correct page info and disable navigation Items

    Given the User "003" is Signed In
    And the Onboarding Welcome Components GET request has been intercepted to retrieve User Onboarding Welcome Components with Fixture Id "002-first-step-completed" for "sc" app
    When the User navigates to "/sc/getting-started"
    And the Onboarding Welcome Components GET request has been completed
    Then the Element with Cypress ID "mm-getting-started-progress-bar-container" should be visible
    And the Element with Cypress ID "getting-started-title" contains the text as "Welcome User"
    And the Element with Cypress ID "getting-started-subtitle" contains the text as "Get set up in just a few minutes with the steps below"
    And the Element with Cypress ID "mm-navigation-item-getting-started" should have a class "mm-app-navigation-item--active"

  Scenario: Should show correct progress bar percentage when user has completed no steps

    Given the User "003" is Signed In
    And the Onboarding Welcome Components GET request has been intercepted to retrieve User Onboarding Welcome Components with Fixture Id "001-no-step-completed" for "sc" app
    When the User navigates to "/sc/getting-started"
    And the Onboarding Welcome Components GET request has been completed
    Then the Element with Cypress ID "mm-getting-started-progress-bar-label" should have the text as "0% Completed"

  Scenario: Should show correct progress bar percentage and redirect to correct pages on click of the CTAs for users with first step completed

    Given the User "003" is Signed In
    And the Onboarding Welcome Components GET request has been intercepted to retrieve User Onboarding Welcome Components with Fixture Id "002-first-step-completed" for "sc" app
    When the User navigates to "/sc/getting-started"
    And the Onboarding Welcome Components GET request has been completed
    Then the Element with Cypress ID "mm-getting-started-progress-bar-label" should have the text as "33% Completed"
    And the User clicks on the Element with Cypress ID "getting-started-step-button-create-group"
    And the User should be redirected to "/sc/groups"
    And the User navigates to "/sc/getting-started"
    And the User clicks on the Element with Cypress ID "getting-started-step-button-create-organizational-unit"
    And the User should be redirected to "/sc/units"
  
 Scenario: Should be able to update progress bar percentage when Step is Marked as Completed, collapse current step and activate next step

    Given the User "003" is Signed In
    And the Onboarding Welcome Components GET request has been intercepted to retrieve User Onboarding Welcome Components with Fixture Id "002-first-step-completed" for "sc" app
    And the User navigates to "/sc/getting-started"
    And the Onboarding Welcome Components GET request has been completed
    And the Element with Cypress ID "mm-getting-started-progress-bar-label" should have the text as "33% Completed"
    And the Onboarding Welcome Components POST request has been intercepted to update progress for Onboarding Step and User Welcome Component with FixtureId "007-welcome-component" for "sc" app
    And the Onboarding Welcome Components GET request has been intercepted to retrieve User updated Onboarding Welcome Components with Fixture Id "003-second-step-completed" for "sc" app
    When the User clicks on the Element with Cypress ID "mm-getting-started-step-SetupOrganizationStructure-checkbox"
    And the Onboarding User Welcome Components POST request has been completed
    And the updated Onboarding Welcome Components GET request has been completed
    Then the Element with Cypress ID "mm-getting-started-progress-bar-label" should have the text as "66% Completed"
    And the Onboarding Welcome Components DELETE request has been intercepted to update progress for Onboarding Step and User Welcome Component with FixtureId "007-welcome-component" for "sc" app
    And the User clicks on the Element with Cypress ID "mm-getting-started-step-SetupOrganizationStructure"
    And the Onboarding Welcome Components GET request has been intercepted to retrieve User updated Onboarding Welcome Components with Fixture Id "002-first-step-completed" for "sc" app
    And the User clicks on the Element with Cypress ID "mm-getting-started-step-SetupOrganizationStructure-checkbox"
    And the Onboarding User Welcome Components DELETE request has been completed
    And the updated Onboarding Welcome Components GET request has been completed
    And the Element with Cypress ID "mm-getting-started-progress-bar-label" should have the text as "33% Completed"

  Scenario: Redirect User to Dashboard, Remove Getting Started Link From Navigation and Enable Navigation Items when user completes all Getting Started Steps

    Given the User "003" is Signed In
    And the Onboarding Welcome Components GET request has been intercepted to retrieve User Onboarding Welcome Components with Fixture Id "003-second-step-completed" for "sc" app
    And the User navigates to "/sc/getting-started"
    And the Onboarding Welcome Components GET request has been completed
    And the Element with Cypress ID "mm-getting-started-progress-bar-label" should have the text as "66% Completed"
    And the Onboarding Welcome Components POST request has been intercepted to update progress for Onboarding Step and User Welcome Component with FixtureId "008-welcome-component" for "sc" app
    And the Onboarding Welcome Components GET request has been intercepted to retrieve User updated Onboarding Welcome Components with Fixture Id "004-third-step-completed" for "sc" app
    When the User clicks on the Element with Cypress ID "mm-getting-started-step-ViewLicensesAndPolicies-checkbox"
    And the Onboarding User Welcome Components POST request has been completed
    And the updated Onboarding Welcome Components GET request has been completed
    Then the Element with Cypress ID "mm-navigation-item-getting-started" should NOT exist
    And the User should be redirected to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"

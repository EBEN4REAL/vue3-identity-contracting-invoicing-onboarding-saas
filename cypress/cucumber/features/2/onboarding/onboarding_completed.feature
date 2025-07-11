Feature: Onboarding - Completion

  Scenario: User Onboarding Uncompleted

    Given the User "001" is Signed In
    And the IAM OAuth Create Token has been intercepted to return the Onboarding Token for User "001"
    And the Onboarding Flow request has been intercepted to return the Flow "create_organization"
    And the User navigates to "/onboarding"
    And the User types "test name" in the Element with selector "#name"
    And the User selects option with Cypress ID "mm-select-option-ESG" in the Select with Cypress ID "select-organization-industry"
    And the User selects option with Cypress ID "mm-select-option-51-200" in the Select with Cypress ID "select-organization-number-of-employees-range"
    And the Onboarding Create Organization request has been intercepted to return the Organization "001"
    And the IAM User @me request has been intercepted to return the User "001"
    When the User clicks on the Element with selector "#next"
    Then the Element with selector "#onboarding-processing-loader" should exist

  Scenario: User Onboarding Completed

    Given the User "001" is Signed In
    And the IAM OAuth Create Token has been intercepted to return the Onboarding Token for User "001"
    And the Onboarding Flow request has been intercepted to return the Flow "create_organization"
    And the User navigates to "/onboarding"
    And the User types "test name" in the Element with selector "#name"
    And the User selects option with Cypress ID "mm-select-option-ESG" in the Select with Cypress ID "select-organization-industry"
    And the User selects option with Cypress ID "mm-select-option-51-200" in the Select with Cypress ID "select-organization-number-of-employees-range"
    And the Onboarding Create Organization request has been intercepted to return the Organization "001"
    And the IAM User @me request has been intercepted to return the User "001OnboardingCompleted"
    When the User clicks on the Element with selector "#next"
    Then the User should be redirected to "/"

  Scenario: User Onboarding Error

    Given the User "001" is Signed In
    And the IAM OAuth Create Token has been intercepted to return the Onboarding Token for User "001"
    And the Onboarding Flow request has been intercepted to return Error
    When the User navigates to "/onboarding"
    Then the Element with Cypress ID "alert" contains the text as "Error while onboarding: Not Found"

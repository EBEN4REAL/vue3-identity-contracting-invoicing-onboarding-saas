Feature: Onboarding - Joined Organization

  Scenario: Subtitle contains correct text
    Given the User "001" is Signed In
    And the IAM OAuth Create Token has been intercepted to return the Onboarding Token for User "001"
    And the Onboarding Flow request has been intercepted to return the Flow "joined_organization"
    When the User navigates to "/onboarding"
    Then the Element with Cypress ID "onboarding-subtitle" contains the text as "Congrats, you have joined your colleagues at Org 001"

  Scenario: Organization card should exist with correct name
    Given the User "001" is Signed In
    And the IAM OAuth Create Token has been intercepted to return the Onboarding Token for User "001"
    And the Onboarding Flow request has been intercepted to return the Flow "joined_organization"
    When the User navigates to "/onboarding"
    Then the Element with Cypress ID "organization-name" contains the text as "Org 001"

  Scenario: User should be redirected to the app after pressing Continue
    Given the User "010OnboardingNotCompleted" is Signed In
    And the IAM OAuth Create Token has been intercepted to return the Onboarding Token for User "010OnboardingNotCompleted"
    And the Onboarding Flow request has been intercepted to return the Flow "joined_organization"
    And the User navigates to "/onboarding"
    And the IAM User @me request has been intercepted to return the service-provider User @me
    And the IAM OAuth Authorize redirects to Authorized for User "010"
    And the IAM Service Provider Metrics request has been intercepted to return the Metrics for Service Provider "001"
    And the IAM Organization request has been intercepted to return the Organization "001Onboarding"
    When the User clicks on the Element with Cypress ID "button-continue"
    Then the User should be redirected to "/sc/getting-started"

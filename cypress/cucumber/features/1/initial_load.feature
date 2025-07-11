Feature: Initial load

  Scenario: Should redirect logged in user to /getting-started if not all getting started steps completed and user navigates to root
    Given the User "005" is Signed In
    And the Onboarding Welcome Components GET request has been intercepted to retrieve User Onboarding Welcome Components with Fixture Id "002-first-step-completed" for "sc" app
    When the User navigates to "/"
    And the Onboarding Welcome Components GET request has been completed
    Then the User should be redirected to "/sc/getting-started"

  Scenario: Should redirect logged in user to /user-profile if getting started steps are completed and user navigates to root
    And the key "GettingStarted" with data "{'allStepsCompleted':true}" should be set in localStorage
    Given the User "002WithoutOrganizations" is Signed In
    When the User navigates to "/"
    Then the User should be redirected to "/user/profile"
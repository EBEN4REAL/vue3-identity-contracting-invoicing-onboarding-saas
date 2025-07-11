Feature: Overview - Organization Dashboard

  Background: Organization Metrics
    Given the IAM Organization Metrics request has been intercepted to return the Metrics for Organization "001"

  Scenario: Unauthorized

    Given no User is Signed In
    And the IAM OAuth Authorize redirects to the Login page
    When the User navigates to "/sc/dashboard"
    Then the User should be redirected to "/login"

  Scenario: Forbidden with non-Org User

    Given the User "001OnboardingCompleted" is Signed In
    When the User navigates to "/sc/dashboard"
    Then the Element with selector "#organization-metrics" should NOT exist
    And the Element with selector "#title" should have the text as "404"

  Scenario: Success with Organization Admin from direct URL

    Given the User "003" is Signed In
    When the User navigates to "/sc/dashboard"
    Then the Element with selector "#organization-metrics" should be visible
    And the Element with selector "#organization-total-users" should have the text as "10"
    And the Element with selector "#active-users-chart" should be visible
    And the Element with selector "#signups-chart" should be visible
    And the Element with selector "#failed-logins-chart" should be visible

  Scenario: Success with Organization Editor from direct URL

    Given the User "004" is Signed In
    When the User navigates to "/sc/dashboard"
    Then the Element with selector "#organization-metrics" should be visible
    And the Element with selector "#organization-total-users" should have the text as "10"
    And the Element with selector "#active-users-chart" should be visible
    And the Element with selector "#signups-chart" should be visible
    And the Element with selector "#failed-logins-chart" should be visible

  Scenario: Success with Organization Viewer from direct URL

    Given the User "005" is Signed In
    When the User navigates to "/sc/dashboard"
    Then the Element with selector "#organization-metrics" should be visible
    And the Element with selector "#organization-total-users" should have the text as "10"
    And the Element with selector "#active-users-chart" should be visible
    And the Element with selector "#signups-chart" should be visible
    And the Element with selector "#failed-logins-chart" should be visible

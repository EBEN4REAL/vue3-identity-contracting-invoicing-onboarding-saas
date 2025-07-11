Feature: Authorized

  Scenario: No matching state found in storage
    Given the IAM OAuth Authorize redirects to the Login page
    When the User navigates to "/authorized?state=UNMATCHED"
    Then the User should be redirected to "/login"

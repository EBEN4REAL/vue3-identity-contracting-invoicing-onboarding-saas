Feature: Home

  @snapshots
  Scenario: Landing redirect

    Given the IAM OAuth Authorize redirects to the Login page
    When the User navigates to "/"
    Then the User should be redirected to "/login"

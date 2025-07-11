Feature: Auth - Logout

  Scenario: Logout
    Given the User "001" is Signed In
    And the IAM OAuth Authorize redirects to the Login page
    And the IAM Logout redirects to "/"
    When the User navigates to "/logout"
    Then the User should be redirected to "/login?next_url"

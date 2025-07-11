Feature: Auth - Logout - Front Channel

  Scenario: Logout Front Channel with single Client ID
    Given no User is Signed In
    And the IAM Logout Front Channel has been intercepted
    And the IAM OAuth Authorize redirects to the Login page
    When the User navigates to "/logout/frontchannel?client_id=5b21ee27-6179-4205-9101-cb392063f7cb&post_logout_redirect_uri=/"
    Then the User should be redirected to "/login?next_url"

  Scenario: Logout Front Channel with multiple Client IDs
    Given no User is Signed In
    And the IAM Logout Front Channel has been intercepted
    And the IAM OAuth Authorize redirects to the Login page
    When the User navigates to "/logout/frontchannel?client_id=5b21ee27-6179-4205-9101-cb392063f7cb&client_id=74457dd1-dbe5-405d-aecf-ee118a5345fc&post_logout_redirect_uri=/"
    Then the User should be redirected to "/login?next_url"

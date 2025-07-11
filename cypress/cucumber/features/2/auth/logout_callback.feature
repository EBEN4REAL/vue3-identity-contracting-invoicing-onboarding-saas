Feature: Auth - Logout - Callback

  Scenario: Logout Callback
    Given the User "001" is Signed In
    When the User navigates to "/logout/callback"
    Then no User should be Signed In

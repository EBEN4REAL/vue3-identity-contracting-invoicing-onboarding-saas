Feature: Access Management - User - Details - Magic Link Setting

  Scenario: Magic link toggle button should exist for user with password and should successfully update magic link when clicked
    Given the User "005" is Signed In
    And the feature flag "magic_link" is enabled
    And the IAM User @me request has been intercepted to return the User "005"
    And the User navigates to "/user/security"
    And the IAM PUT User @me Magic Link request has been intercepted to update user magic link setting
    When the User clicks on the Element with Cypress ID "mm-toggle-button-magic-link"    
    And the IAM PUT User @me Magic Link request has been completed

  Scenario: Magic link toggle button should not exist if user has no password
    Given the User "003-without-password" is Signed In
    And the feature flag "magic_link" is enabled
    And the IAM User @me request has been intercepted to return the User "003-without-password"
    When the User navigates to "/user/security"
    Then the Element with Cypress ID "magic-link-setting" should NOT exist
  
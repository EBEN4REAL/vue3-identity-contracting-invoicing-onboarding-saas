Feature: Security Password

  Scenario: User should see warning dialog after using pwned password when changing password
    Given the User "003" is Signed In
    And the IAM User @me request has been intercepted to return the User "003"
    And the IAM User @me sessions request has been intercepted to return IP's "127.0.0.1"
    And the IAM User @me social accounts request has been intercepted to return "G-user.003@example.com"
    And the IAM login histories @me request has been intercepted to return IP's "127.0.0.1"
    And the User navigates to "/user/security"
    And the intercepted requests have resolved
    And the Element with Cypress ID "button-change-password" should exist
    And the User clicks on the Element with Cypress ID "button-change-password"
    And the User types "Qfawf89(*h9vV(*hV98h" in Input inside Element with Cypress ID "dialog-change-password old-password"
    And the User types "m#P52s@ap$V" in Input inside Element with Cypress ID "dialog-change-password new-password"
    And the User clicks outside
    And the IAM PUT password request with 406 status response has been intercepted
    When the User clicks on the Element with Cypress ID "dialog-change-password button-submit"
    Then the Element with Cypress ID "dialog-password-security-breach" should exist

  Scenario: User should change password after submitting security breach warning dialog
    Given the User "003" is Signed In
    And the IAM User @me request has been intercepted to return the User "003"
    And the IAM User @me sessions request has been intercepted to return IP's "127.0.0.1"
    And the IAM User @me social accounts request has been intercepted to return "G-user.003@example.com"
    And the IAM login histories @me request has been intercepted to return IP's "127.0.0.1"
    And the User navigates to "/user/security"
    And the User clicks on the Element with Cypress ID "button-change-password"
    And the User types "Qfawf89(*h9vV(*hV98h" in Input inside Element with Cypress ID "dialog-change-password old-password"
    And the User types "m#P52s@ap$V" in Input inside Element with Cypress ID "dialog-change-password new-password"
    And the IAM PUT password request with 406 status response has been intercepted
    And the User clicks on the Element with Cypress ID "dialog-change-password button-submit"
    And the User clicks on the Element with Cypress ID "dialog-password-security-breach button-submit"
    And the IAM PUT password successful request with override pwned has been intercepted
    When the User clicks on the Element with Cypress ID "dialog-change-password button-submit"
    Then the Element with Cypress ID "mm-toast" contains the text as "Your password was updated successfully"

  Scenario: User should set password after submitting security breach warning dialog
    Given the User "003-without-password" is Signed In
    And the IAM User @me request has been intercepted to return the User "003-without-password"
    And the IAM User @me sessions request has been intercepted to return IP's "127.0.0.1"
    And the IAM User @me social accounts request has been intercepted to return "G-user.003@example.com"
    And the IAM login histories @me request has been intercepted to return IP's "127.0.0.1"
    And the User navigates to "/user/security"
    And the User clicks on the Element with Cypress ID "button-set-password"
    And the User types "m#P52s@ap$V" in Input inside Element with Cypress ID "dialog-set-password new-password"
    And the IAM POST password request with 406 status response has been intercepted
    And the User clicks on the Element with Cypress ID "dialog-set-password button-submit"
    And the User clicks on the Element with Cypress ID "dialog-password-security-breach button-submit"
    And the IAM POST password successful request with override pwned has been intercepted
    And the IAM GET User @me TOTP request has been intercepted to return confirmed TOTP
    When the User clicks on the Element with Cypress ID "dialog-set-password button-submit"
    Then the Element with Cypress ID "mm-toast" contains the text as "Your password was set successfully"

Feature: Access Management - User - Details - 2FA

  Scenario: Button Setup Authentication should exist
    Given the User "005" is Signed In
    And the feature flag "totp" is enabled
    And the IAM User @me request has been intercepted to return the User "005"
    And the IAM GET User @me TOTP request has been intercepted to return 404
    When the User navigates to "/user/security"
    Then the Element with Cypress ID "button-setup-authentication" should exist

  Scenario: Button Setup TOTP should NOT exist if user has no password
    Given the User "003-without-password" is Signed In
    And the feature flag "totp" is enabled
    And the IAM User @me request has been intercepted to return the User "003-without-password"
    And the IAM GET User @me TOTP request has been intercepted to return 404
    When the User navigates to "/user/security"
    Then the Element with Cypress ID "button-setup-authentication" should NOT exist

  Scenario: After user password is confirmed Dialog Setup 2FA should exist and Dialog Verification Required should not exist
    Given the User "005" is Signed In
    And the feature flag "totp" is enabled
    And the IAM User @me request has been intercepted to return the User "005"
    And the IAM GET User @me TOTP request has been intercepted to return 404
    And the User navigates to "/user/security"
    And the User clicks on the Element with Cypress ID "button-setup-authentication"
    And the Element with Cypress ID "dialog-verification-required button-submit" should be disabled
    And the User types "somepassword" in Input inside Element with Cypress ID "input-current-password"
    And the Element with Cypress ID "dialog-verification-required button-submit" should be NOT disabled
    And the IAM POST User @me TOTP request has been intercepted to return qr_url with secret "somepassword_generatedsecret"
    When the User clicks on the Element with Cypress ID "dialog-verification-required button-submit"
    Then the Element with Cypress ID "dialog-verification-required" should NOT exist
    And the Element with Cypress ID "dialog-setup-two-factor-authentication" should exist

  Scenario: QR Code should exist in Dialog Setup 2FA
    Given the User "005" is Signed In
    And the feature flag "totp" is enabled
    And the IAM User @me request has been intercepted to return the User "005"
    And the IAM GET User @me TOTP request has been intercepted to return 404
    And the User navigates to "/user/security"
    And the User clicks on the Element with Cypress ID "button-setup-authentication"
    And the User types "somepassword" in Input inside Element with Cypress ID "input-current-password"
    And the IAM POST User @me TOTP request has been intercepted to return qr_url with secret "somepassword_generatedsecret"
    When the User clicks on the Element with Cypress ID "dialog-verification-required button-submit"
    Then the Element with Cypress ID "dialog-setup-two-factor-authentication qr-code" should have the image inside

  Scenario: Secret should be correct in Dialog Setup 2FA
    Given the User "005" is Signed In
    And the feature flag "totp" is enabled
    And the IAM User @me request has been intercepted to return the User "005"
    And the IAM GET User @me TOTP request has been intercepted to return 404
    And the User navigates to "/user/security"
    And the User clicks on the Element with Cypress ID "button-setup-authentication"
    And the User types "somepassword" in Input inside Element with Cypress ID "input-current-password"
    And the IAM POST User @me TOTP request has been intercepted to return qr_url with secret "somepassword_generatedsecret"
    When the User clicks on the Element with Cypress ID "dialog-verification-required button-submit"
    Then the Element with Cypress ID "dialog-setup-two-factor-authentication secret" contains the text as "somepassword_generatedsecret"

  Scenario: Backup codes should be correct in Dialog Backup Codes
    Given the User "005" is Signed In
    And the feature flag "totp" is enabled
    And the IAM User @me request has been intercepted to return the User "005"
    And the IAM GET User @me TOTP request has been intercepted to return 404
    And the User navigates to "/user/security"
    And the User clicks on the Element with Cypress ID "button-setup-authentication"
    And the User types "somepassword" in Input inside Element with Cypress ID "input-current-password"
    And the IAM POST User @me TOTP request has been intercepted to return qr_url with secret "somepassword_generatedsecret"
    And the User clicks on the Element with Cypress ID "dialog-verification-required button-submit"
    And the User types "123456" in Input inside Element with Cypress ID "input-6-digit-code"
    And the IAM PUT User @me TOTP request has been intercepted to return confirmed TOTP and backup codes "01234567,11234567,21234567,31234567,41234567,51234567,61234567"
    When the User force clicks on the Element with Cypress ID "dialog-setup-two-factor-authentication button-submit"
    Then the Element with Cypress ID "backup-code-0" contains the text as "01234567"
    And the Element with Cypress ID "backup-code-1" contains the text as "11234567"
    And the Element with Cypress ID "backup-code-2" contains the text as "21234567"
    And the Element with Cypress ID "backup-code-3" contains the text as "31234567"
    And the Element with Cypress ID "backup-code-4" contains the text as "41234567"
    And the Element with Cypress ID "backup-code-5" contains the text as "51234567"
    And the Element with Cypress ID "backup-code-6" contains the text as "61234567"

  Scenario: Backup codes should be copied correctly in Dialog Backup Codes
    Given the User "005" is Signed In
    And the feature flag "totp" is enabled
    And the IAM User @me request has been intercepted to return the User "005"
    And the IAM GET User @me TOTP request has been intercepted to return 404
    And the User navigates to "/user/security"
    And the User clicks on the Element with Cypress ID "button-setup-authentication"
    And the User types "somepassword" in Input inside Element with Cypress ID "input-current-password"
    And the IAM POST User @me TOTP request has been intercepted to return qr_url with secret "somepassword_generatedsecret"
    And the User clicks on the Element with Cypress ID "dialog-verification-required button-submit"
    And the User types "123456" in Input inside Element with Cypress ID "input-6-digit-code"
    And the IAM PUT User @me TOTP request has been intercepted to return confirmed TOTP and backup codes "01234567,11234567,21234567,31234567,41234567,51234567,61234567"
    And the User force clicks on the Element with Cypress ID "dialog-setup-two-factor-authentication button-submit"
    When the User clicks on the Element with Cypress ID "button-copy-backup-codes"
    Then the Element with Cypress ID "mm-toast" contains the text as "Backup codes copied successfully!"

  Scenario: Button Reset Authentication should exist after User sets up 2FA
    Given the User "005" is Signed In
    And the feature flag "totp" is enabled
    And the IAM User @me request has been intercepted to return the User "005"
    And the IAM GET User @me TOTP request has been intercepted to return 404
    And the User navigates to "/user/security"
    And the User clicks on the Element with Cypress ID "button-setup-authentication"
    And the User types "somepassword" in Input inside Element with Cypress ID "input-current-password"
    And the IAM POST User @me TOTP request has been intercepted to return qr_url with secret "somepassword_generatedsecret"
    And the User clicks on the Element with Cypress ID "dialog-verification-required button-submit"
    And the User types "123456" in Input inside Element with Cypress ID "input-6-digit-code"
    And the IAM PUT User @me TOTP request has been intercepted to return confirmed TOTP and backup codes "01234567,11234567,21234567,31234567,41234567,51234567,61234567"
    When the User force clicks on the Element with Cypress ID "dialog-setup-two-factor-authentication button-submit"
    Then the Element with Cypress ID "button-reset-authentication" should exist

  Scenario: User should reset authentication
    Given the User "005" is Signed In
    And the feature flag "totp" is enabled
    And the IAM User @me request has been intercepted to return the User "005"
    And the IAM GET User @me TOTP request has been intercepted to return confirmed TOTP
    And the User navigates to "/user/security"
    And the User clicks on the Element with Cypress ID "button-reset-authentication"
    And the IAM DELETE User @me TOTP request has been intercepted to delete TOTP
    When the User clicks on the Element with Cypress ID "dialog-confirm-reset-authentication button-submit"
    Then the Element with Cypress ID "dialog-verification-required" should exist
    And the Element with Cypress ID "button-setup-authentication" should exist
    And the Element with Cypress ID "button-reset-authentication" should NOT exist

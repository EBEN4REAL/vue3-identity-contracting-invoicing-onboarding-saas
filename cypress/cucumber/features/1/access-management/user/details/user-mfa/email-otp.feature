Feature: Access Management - User - Details - Email OTP

    Scenario: Setup Email OTP Button should NOT exist if user has no password
        Given the User "003" is Signed In
        And the feature flag "email_otp" is enabled
        And the IAM User @me request has been intercepted to return the User "003"
        And the IAM User @me request has been intercepted to return the User "003-without-password"
        When the User navigates to "/user/security"
        Then the Element with Cypress ID "email-otp-setting" should NOT exist
    
    Scenario: Email OTP toggle button should successfully update Email OTP setting when clicked
        Given the User "005" is Signed In
        And the feature flag "email_otp" is enabled
        And the IAM User @me request has been intercepted to return the User "005"
        And the User navigates to "/user/security"
        And the IAM PUT User @me Email OTP request has been intercepted to update user Email OTP setting
        And the User clicks on the Element with Cypress ID "mm-toggle-button-email-otp"    
        And the intercepted requests have resolved
        And the Element with Cypress ID "mm-toggle-button-email-otp" should have a class "mm-toggle-button-email-otp-enabled"
        And the IAM PUT User @me Email OTP request has been intercepted to update user Email OTP setting
        When the User clicks on the Element with Cypress ID "mm-toggle-button-email-otp"
        And the intercepted requests have resolved
        Then the Element with Cypress ID "mm-toggle-button-email-otp" should have a class "mm-toggle-button-email-otp-disabled"
        

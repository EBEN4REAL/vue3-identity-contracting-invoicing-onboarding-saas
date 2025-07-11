Feature: Auth - Signup With MFA

    Scenario: Should be Redirected to TOTP MFA screen when TOTP MFA method is selected
        Given the IAM OAuth Authorize redirects to the Login page with username "user@example.com"
        And the User navigates to "/login"
        And the User should be redirected to "/login"
        And the URL should contain the param "next_url"
        And the Input inside Element with Cypress ID "username" should have the value as "user@example.com"
        And the Element with Cypress ID "password" should be visible
        When the User types "somepassword" in Input inside Element with Cypress ID "password"
        And the User navigates to "http://localhost:5172/signup/mfa?next_url=NEXT_URL&csrf_token=CSRF_TOKEN&username=eben-mfa-8%40test.com&mfa_methods=TOTP,WEBAUTHN,EMAIL_OTP"
        And the User clicks on the Element with Cypress ID "mfa-method-selected-TOTP"
        And the IAM POST MFA Signup redirects to TOTP screen when TOTP MFA method is selected
        Then the user should be redirected to TOTP page

    Scenario: Should be Redirected to Webauthn MFA screen when Webauthn MFA method is selected
        Given the IAM OAuth Authorize redirects to the Login page with username "user@example.com"
        And the User navigates to "/login"
        And the User should be redirected to "/login"
        And the URL should contain the param "next_url"
        And the Input inside Element with Cypress ID "username" should have the value as "user@example.com"
        And the Element with Cypress ID "password" should be visible
        When the User types "somepassword" in Input inside Element with Cypress ID "password"
        And the User navigates to "http://localhost:5172/signup/mfa?next_url=NEXT_URL&csrf_token=CSRF_TOKEN&username=eben-mfa-8%40test.com&mfa_methods=WEBAUTHN,EMAIL_OTP,TOTP"
        And the User clicks on the Element with Cypress ID "mfa-method-selected-WEBAUTHN"
        And the IAM POST MFA Signup redirects to Webauthn screen when Webauthn MFA method is selected
        Then the user should be redirected to Webauthn page

    Scenario: Should be Redirected to Email OTP screen when Email OTP MFA method is selected
        Given the IAM OAuth Authorize redirects to the Login page with username "user@example.com"
        And the User navigates to "/login"
        And the User should be redirected to "/login"
        And the URL should contain the param "next_url"
        And the Input inside Element with Cypress ID "username" should have the value as "user@example.com"
        And the Element with Cypress ID "password" should be visible
        When the User types "somepassword" in Input inside Element with Cypress ID "password"
        And the User navigates to "http://localhost:5172/signup/mfa?next_url=NEXT_URL&csrf_token=CSRF_TOKEN&username=eben-mfa-8%40test.com&mfa_methods=EMAIL_OTP,TOTP,WEBAUTHN"
        And the User clicks on the Element with Cypress ID "mfa-method-selected-EMAIL_OTP"
        And the IAM POST MFA Signup redirects to Email OTP screen when Email OTP MFA method is selected
        Then the user should be redirected to Email OTP page


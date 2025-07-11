Feature: Auth - Login

  Scenario: Redirect to login page on landing with sp settings for button and logo
    Given the IAM OAuth Authorize redirects to the Login page with sp "001"
    And the User navigates to "/"
    Then the User should be redirected to "/login"
    And the URL should contain the param "next_url"
    And the Element with Cypress ID "continue-with-google" should be visible
    And the Element with Cypress ID "continue-with-microsoft" should be visible
    And the Element with Cypress ID "username" should be visible
    And the Element with Cypress ID "back-to" should NOT exist
    And the Element with Cypress ID "forgot-password" should NOT exist
    And the Element with Cypress ID "log-in" should be visible
    Then the Element with Cypress ID "log-in" should have the color "rgb(226, 60, 157)"
    Then the Element with Cypress ID "log-in" should have the text color "rgb(255, 255, 255)"

  Scenario: Should validates user Webauth credentials successfully on Login
    Given the IAM OAuth Authorize redirects to the Login page with username "user@example.com"
    And the User navigates to "/login"
    And the User should be redirected to "/login"
    And the URL should contain the param "next_url"
    And the Input inside Element with Cypress ID "username" should have the value as "user@example.com"
    And the Element with Cypress ID "password" should be visible
    When the User types "somepassword" in Input inside Element with Cypress ID "password"
    And the User navigates to "/login?stage=2&csrf_token=CSRF_TOKEN&next_url=NEXT_URL&username=eben-webauth-28%40test.com&mfa_methods=WEBAUTHN&webauthn_options=WEBAUTHN_OPTIONS"
    And the User successfully validates on webauthn after clicking the button with Cypress ID "mm-mfa-option-webauth" with mock response "001-webauthn-credential" and parsed options "003-webauth-registration-response"

  Scenario: Should be able to login with Email OTP successfully
    Given the IAM OAuth Authorize redirects to the Login page with username "user@example.com"
    And the feature flag "email_otp" is enabled
    And the User navigates to "/login"
    And the User should be redirected to "/login"
    And the URL should contain the param "next_url"
    And the Input inside Element with Cypress ID "username" should have the value as "user@example.com"
    And the Element with Cypress ID "password" should be visible
    When the User types "somepassword" in Input inside Element with Cypress ID "password"
    And the User navigates to "/login?stage=2&csrf_token=CSRF_TOKEN&next_url=http://localhost/oauth2/authorize&username=eben-webauth-28%40test.com&mfa_methods=EMAIL_OTP"
    And the User types "123456" in Input inside Element with Cypress ID "login-with-email-otp-code"
    And the IAM POST request to login with Email OTP has been intercepted
    And the User clicks on the Element with Cypress ID "login-with-email-otp"
    Then the user should be logged in with Email OTP

  Scenario: Should be able to navigate back to login page from Email OTP screen successfully
    Given the IAM OAuth Authorize redirects to the Login page with username "user@example.com"
    And the feature flag "email_otp" is enabled
    And the User navigates to "/login"
    And the User should be redirected to "/login"
    And the URL should contain the param "next_url"
    And the Input inside Element with Cypress ID "username" should have the value as "user@example.com"
    And the Element with Cypress ID "password" should be visible
    And the User types "somepassword" in Input inside Element with Cypress ID "password"
    And the User navigates to "/login?stage=2&csrf_token=CSRF_TOKEN&next_url=http://localhost/oauth2/authorize&username=eben-webauth-28%40test.com&mfa_methods=EMAIL_OTP"
    When the User clicks on the Element with Cypress ID "button-email-otp-login-back-to"
    Then the User should be redirected to "/login"

  Scenario: Login page with default settings for button and logo
    Given the IAM OAuth Authorize redirects to the Login page with sp "002"
    And the User navigates to "/"
    Then the User should be redirected to "/login"
    And the URL should contain the param "next_url"
    And the Element with Cypress ID "log-in" should be visible
    Then the Element with Cypress ID "log-in" should have the color "rgb(7, 46, 81)"
    Then the Element with Cypress ID "log-in" should have the text color "rgb(255, 255, 255)"

  Scenario: Login Page from direct URL with Username must show password
    Given the IAM OAuth Authorize redirects to the Login page with username "user@example.com"
    And the User navigates to "/login"
    Then the User should be redirected to "/login"
    And the URL should contain the param "next_url"
    And the Input inside Element with Cypress ID "username" should have the value as "user@example.com"
    Then the Element with Cypress ID "password" should be visible
    Then the Element with Cypress ID "back-to" should be visible
    Then the Element with Cypress ID "forgot-password" should be visible
    And the User clicks on the Element with Cypress ID "continue"

  Scenario: Login Page from direct URL with stage value as 0 must show email
    Given the IAM OAuth Authorize with stage 0 redirects to the Login page with username "test@test.pt"
    And the User navigates to "/login"
    Then the User should be redirected to "/login"
    And the URL should contain the param "next_url"
    Then the Element with Cypress ID "username" should be visible
    And the User clicks on the Element with Cypress ID "log-in"

  Scenario: Login Page from direct URL without Next URL
    Given the IAM OAuth Authorize redirects to the Login page
    And the User navigates to "/login"
    Then the User should be redirected to "/login"
    And the URL should contain the param "next_url"

  Scenario: Login Page from direct URL with Organization ID and without Next URL
    Given the IAM OAuth Authorize redirects to the Login page
    And the User navigates to "/login?organization_id=ORGANIZATION_ID"
    Then the User should be redirected to "/login"
    And the URL should contain the param "next_url"

  Scenario: Login Page from direct URL without CSRF Token
    Given the IAM Login redirects to the Login page
    And the User navigates to "/login?next_url=http://localhost/oauth2/authorize"
    Then the User should be redirected to "/login"
    And the URL should contain the param "next_url"
    And the URL should contain the param "csrf_token"

  Scenario: Login with Google
    Given the IAM Login with Google has been intercepted
    And the IAM OAuth Authorize redirects to the Login page
    And the User navigates to "/"
    Then the User should be redirected to "/login"
    And the URL should contain the param "next_url"
    When the User clicks on the Element with Cypress ID "continue-with-google"
    Then the User should be redirected to the IAM Login with Google page

  Scenario: Login with Magic Link
    Given the IAM Login with Google has been intercepted
    And the feature flag "magic_link" is enabled
    And the IAM OAuth Authorize redirects to the Login page
    And the User navigates to "/"
    And the User should be redirected to "/login"
    And the URL should contain the param "next_url"
    And the IAM Login with Magic Link POST request has been intercepted
    When the User clicks on the Element with Cypress ID "continue-with-magic-link"
    Then the user should be redirected to login page and appropriate email sent success message should be shown
    And the Element with Cypress ID "login-form-alert-success" contains the text as "An email has been sent to you, click on the email to login to the portal"

  Scenario: Login with SSO
    Given the IAM OAuth Authorize redirects to the Login page
    And the User navigates to "/login/sso?next_url=http%3A%2F%2Flocalhost%2Foauth2%2Fauthorize%3Fclient_id%3Ddc742b28-47f6-11ee-be56-0242ac120002%26redirect_uri%3Dhttp%253A%252F%252Flocalhost%253A5172%252Fauthorized%26response_type%3Dcode%26scope%3Dopenid%2Bemail%2Bprofile%26state%3De1b01978c9c84c02b3c439695434641d%253B%252Fsc%252Forganizations%252F00000000-0000-0000-0002-000000000001%26code_challenge%3DGhapCmj62G4rjego_PjZjr4sr0OlPIFOMw0DJAiAljE%26code_challenge_method%3DS256%26response_mode%3Dquery&csrf_token=e057dd2a9c90800d01af05d14f642f72eed43715"
    When the User types "user@example.com" in the Element with Cypress ID "login-with-sso-form login-with-sso-email-input"
    And the IAM Login with SSO POST request has been intercepted with Organization "001"
    And the User clicks on the Element with Cypress ID "login-with-sso-form continue"
    Then the User should be redirected to the organization dashboard with the Organization Fixture Id "001"

  Scenario: Should redirect to the appropriate page and show proper error message to the user if SSO is not configured or is disabled when Signing in with SSO
    Given the IAM OAuth Authorize redirects to the Login page
    And the User navigates to "/login/sso?next_url=http%3A%2F%2Flocalhost%2Foauth2%2Fauthorize%3Fclient_id%3Ddc742b28-47f6-11ee-be56-0242ac120002%26redirect_uri%3Dhttp%253A%252F%252Flocalhost%253A5172%252Fauthorized%26response_type%3Dcode%26scope%3Dopenid%2Bemail%2Bprofile%26state%3De1b01978c9c84c02b3c439695434641d%253B%252Fsc%252Forganizations%252F00000000-0000-0000-0002-000000000001%26code_challenge%3DGhapCmj62G4rjego_PjZjr4sr0OlPIFOMw0DJAiAljE%26code_challenge_method%3DS256%26response_mode%3Dquery&csrf_token=e057dd2a9c90800d01af05d14f642f72eed43715"
    When the User types "user@example.com" in the Element with Cypress ID "login-with-sso-form login-with-sso-email-input"
    And the IAM Login with SSO POST request has been intercepted for Organization Without SSO Configuration
    And the User clicks on the Element with Cypress ID "login-with-sso-form continue"
    Then the user should be redirected to SSO page and appropriate error message should be shown if SSO is not configured
    And the Element with Cypress ID "login-form-alert" contains the text as "Username is not configured for SSO"

  Scenario: Login with Microsoft
    Given the IAM Login with Microsoft has been intercepted
    And the IAM OAuth Authorize redirects to the Login page
    And the User navigates to "/"
    Then the User should be redirected to "/login"
    And the URL should contain the param "next_url"
    When the User clicks on the Element with Cypress ID "continue-with-microsoft"
    Then the User should be redirected to the IAM Login with Microsoft page

  Scenario: Authorized User accessing Login page with Next URL
    Given the User "001" is Signed In
    When the User navigates to "/login?next_url=http://nexturl.com"
    Then the User should be redirected to "http://nexturl.com"

  Scenario: Authorized User accessing Login page without Next URL
    Given the User "001" is Signed In
    When the User navigates to "/login"
    Then the User should be redirected to "/"

  Scenario: Should be correctly redirected on back to login
    Given the IAM OAuth Authorize redirects to the Login page with username "user@example.com"
    And the User navigates to "/login"
    Then the User should be redirected to "/login"
    And the URL should contain the param "next_url"
    And the Input inside Element with Cypress ID "username" should have the value as "user@example.com"
    Then the Element with Cypress ID "back-to" should be visible
    Then the Element with Cypress ID "forgot-password" should be visible
    And the User clicks on the Element with Cypress ID "back-to"
    Then the User should be redirected to "/login"

  Scenario: Should Show login organizations and successfully redirect user to organization dashboard
    Given the API request for login organizations is intercepted with username "user@metricsmatter.com"
    And the User navigates to "/login?stage=3&csrf_token=3cb20fc70530d56304473e6453681f3052a5c42f&next_url=http%3A%2F%2Flocalhost%2Foauth2%2Fauthorize%3Fclient_id%3Ddc742b28-47f6-11ee-be56-0242ac120002%26redirect_uri%3Dhttp%253A%252F%252Flocalhost%253A5172%252Fauthorized%26response_type%3Dcode%26scope%3Dopenid%2Bemail%2Bprofile%26state%3D0fb3fa79b09443ae84a7a6ef7f4d487a%26code_challenge%3DLwhOr2_vSmWM06JuyHdrtLbqU8I_EWtYH6YPwJ4aMmc%26code_challenge_method%3DS256%26response_mode%3Dquery&username=user%40metricsmatter.com&code=obJ9AIYTuIpPztoYnGgbW1uFjlRGMdGyQrfXdpKlBc"
    And the login organizations should be displayed
    And the Element with Cypress ID "select-organization-header" should be visible
    And the Element with Cypress ID "login-select-organization-form" should be visible
    And the Element with Cypress ID "login-select-organization-form continue" should be disabled
    And the User clicks on the Element with Cypress ID "select-organization autocomplete"
    And the User clicks on the Element with Cypress ID "mm-autocomplete-option-f3c7fe92-ff18-464b-b1f5-70a130c93989"
    And the Element with Cypress ID "login-select-organization-form continue" should be NOT disabled
    And the POST request for login organization has been intercepted with id "f3c7fe92-ff18-464b-b1f5-70a130c93989"
    When the User clicks on the Element with Cypress ID "continue"
    Then verify that the user is currently in the organization dashboard with the id "f3c7fe92-ff18-464b-b1f5-70a130c93989"

  Scenario: Should be correctly redirected to Setup 2FA
    Given the IAM OAuth Authorize redirects to the Signup Confirmation
    And the IAM POST Signup TOTP redirects to the Signup Confirmation page with Success Status
    And the User navigates to "/signup/totp?csrf_token=9b783063e93859657bdf4e8659edcef8a0d357e9&username=user%40metricsmatter.com&qr_url=otpauth%3A%2F%2Ftotp%2FAcme%2520Inc.%3Auser%2540metricsmatter.com%3Fsecret%3DUL3LB4NXXDU5HZ5I6GFRBYVXXSJZKWEK%26issuer%3DAcme%2520Inc.&sp=eyJuYW1lIjoiQWNtZSBJbmMuIiwibG9nb191cmwiOm51bGwsImZhcV91cmwiOm51bGwsImJ1dHRvbl9iYWNrZ3JvdW5kX2NvbG9yIjpudWxsLCJidXR0b25fdGV4dF9jb2xvciI6bnVsbH0%3D"
    And the Element with Cypress ID "input-6-digit-code" should be visible
    And the Element with Cypress ID "copy-key" should exist
    And the User clicks on the Element with Cypress ID "copy-key"
    Then the Element with Cypress ID "success-copy-toast" should be visible
    When the User types "123456" in Input inside Element with Cypress ID "input-6-digit-code"
    And the User force clicks on the Element with Cypress ID "button"
    Then the User should be redirected to "/signup/confirmation"

  Scenario: Verify with 2FA page should have correct default Remember TOTP days duration
    When the User navigates to "/login?stage=2&next_url=http://localhost/oauth2/authorize&csrf_token=CSRF_TOKEN&username=USERNAME&remember_totp=30"
    Then the Element with Cypress ID "remember_totp" contains the text as "Don’t ask again for 30 days"

  Scenario: Verify with 2FA page should have correct Remember TOTP days duration from URL query params
    When the User navigates to "/login?stage=2&next_url=http://localhost/oauth2/authorize&csrf_token=CSRF_TOKEN&username=USERNAME&remember_totp=20"
    Then the Element with Cypress ID "remember_totp" contains the text as "Don’t ask again for 20 days"

  Scenario: User should see block Verify with backup code
    Given the User navigates to "/login?stage=2&next_url=http://localhost/oauth2/authorize&csrf_token=CSRF_TOKEN&username=USERNAME&remember_totp=20"
    When the User clicks on the Element with Cypress ID "button-show-verify-with-backup-code"
    Then the Element with Cypress ID "verify-with-backup-code" should exist

  Scenario: User should see block Verification required
    Given the User navigates to "/login?stage=2&next_url=http://localhost/oauth2/authorize&csrf_token=CSRF_TOKEN&username=USERNAME&remember_totp=20"
    And the User clicks on the Element with Cypress ID "button-show-verify-with-backup-code"
    When the User clicks on the Element with Cypress ID "button-show-verification-required"
    Then the Element with Cypress ID "verification-required" should exist

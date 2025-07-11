Feature: Signup

  @snapshots
  Scenario: User should be able to signup with Webauthn successfully
    Given the IAM OAuth Authorize redirects to the Login page
    And the feature flag "webauthn" is enabled
    And the User navigates to "/"
    And the User should be redirected to "/login"
    When the User clicks on the Element with Cypress ID "signup"
    And the User should be redirected to "/signup"
    And the User types "user@email.com" in Input inside Element with Cypress ID "input-signup-email"
    And the IAM POST Signup redirects to the Signup page with Success for Email "email@email.com"
    And the User clicks on the Element with Cypress ID "button-signup-submit"
    Then the Element with Cypress ID "check-your-email" should exist
    And the Element with Cypress ID "email-for-verification" should have the text as "email@email.com"
    And the User navigates to "/signup/webauthn?next_url=NEXT_URL&screen_hint%3Dsignup&csrf_token=CSRF_TOKEN&username=user@example.com&webauthn_options=WEBAUTHN_OPTIONS"
    And the User successfully validates on webauthn after clicking the button with Cypress ID "mm-mfa-option-webauth" with mock response "001-webauthn-credential" and parsed options "003-webauth-registration-response"
  
  Scenario: Verify that Usesr can choose a different MFA method after biometrics registration fails
    Given the IAM OAuth Authorize redirects to the Login page
    And the feature flag "webauthn" is enabled
    And the User navigates to "/"
    And the User should be redirected to "/login"
    And the User clicks on the Element with Cypress ID "signup"
    And the User should be redirected to "/signup"
    And the User types "user@email.com" in Input inside Element with Cypress ID "input-signup-email"
    And the IAM POST Signup redirects to the Signup page with Success for Email "email@email.com"
    And the User clicks on the Element with Cypress ID "button-signup-submit"
    And the Element with Cypress ID "check-your-email" should exist
    And the Element with Cypress ID "email-for-verification" should have the text as "email@email.com"
    When the User navigates to "/signup/webauthn?next_url=NEXT_URL&screen_hint%3Dsignup&csrf_token=CSRF_TOKEN&username=user@example.com&webauthn_options=eyJycCI6IHsibmFtZSI6ICJWZXJpYW0iLCAiaWQiOiAibG9jYWxob3N0In0sICJ1c2VyIjogeyJpZCI6ICI3QlZ5QTFNbTZqSHJQNGhjdHVQdk9CWmRQVnJILVFkOXRwMnJTNm9IcWRBZFRLRmlwbFR6RTQ3LTZFcG95UFJNODEyLXNrX2d1MFJodk1BamUxNlFhdyIsICJuYW1lIjogImViZW4rc2V0KzcwQHRlc3QuY29tIiwgImRpc3BsYXlOYW1lIjogImViZW4rc2V0KzcwQHRlc3QuY29tIn0sICJjaGFsbGVuZ2UiOiAib2hwanZaR3Fja2sxN1JSWEFYYXFKYTVCRjhzdEE0TEVRWTExVDQwTXBDaHpyOE5jRktFdlN2X0l4OGZsMWlBc1NXUnVPTWNUTHBqQkN6UnRLYnlxTUEiLCAicHViS2V5Q3JlZFBhcmFtcyI6IFt7InR5cGUiOiAicHVibGljLWtleSIsICJhbGciOiAtN30sIHsidHlwZSI6ICJwdWJsaWMta2V5IiwgImFsZyI6IC04fSwgeyJ0eXBlIjogInB1YmxpYy1rZXkiLCAiYWxnIjogLTM2fSwgeyJ0eXBlIjogInB1YmxpYy1rZXkiLCAiYWxnIjogLTM3fSwgeyJ0eXBlIjogInB1YmxpYy1rZXkiLCAiYWxnIjogLTM4fSwgeyJ0eXBlIjogInB1YmxpYy1rZXkiLCAiYWxnIjogLTM5fSwgeyJ0eXBlIjogInB1YmxpYy1rZXkiLCAiYWxnIjogLTI1N30sIHsidHlwZSI6ICJwdWJsaWMta2V5IiwgImFsZyI6IC0yNTh9LCB7InR5cGUiOiAicHVibGljLWtleSIsICJhbGciOiAtMjU5fV0sICJ0aW1lb3V0IjogNjAwMDAsICJleGNsdWRlQ3JlZGVudGlhbHMiOiBbXSwgImF1dGhlbnRpY2F0b3JTZWxlY3Rpb24iOiB7InJlcXVpcmVSZXNpZGVudEtleSI6IGZhbHNlLCAidXNlclZlcmlmaWNhdGlvbiI6ICJyZXF1aXJlZCJ9LCAiYXR0ZXN0YXRpb24iOiAibm9uZSJ9&"
    And biometrics registration fails for the user
    Then the Element with Cypress ID "button-choose-different-option" should be visible

  Scenario: User should be able to signup with Email OTP successfully
    Given the IAM OAuth Authorize redirects to the Login page
    And the feature flag "email_otp" is enabled
    And the User navigates to "/"
    And the User should be redirected to "/login"
    When the User clicks on the Element with Cypress ID "signup"
    And the User should be redirected to "/signup"
    And the User types "user@email.com" in Input inside Element with Cypress ID "input-signup-email"
    And the IAM POST Signup redirects to the Signup page with Success for Email "email@email.com"
    And the User clicks on the Element with Cypress ID "button-signup-submit"
    Then the Element with Cypress ID "check-your-email" should exist
    And the Element with Cypress ID "email-for-verification" should have the text as "email@email.com"
    And the User navigates to "/signup/email-otp?next_url=NEXT_URL&csrf_token=c90de3f9daf38bfcdeac7f0000d1f06491255f01&username=eben-mfa-10%40test.com"
    And the User types "123456" in Input inside Element with Cypress ID "signup-with-email-otp-code"
    And the IAM POST request to signup with Email OTP has been intercepted
    And the User clicks on the Element with Cypress ID "signup-with-email-otp"
    And the user should be signed up with Email OTP

  Scenario: Should be able to navigate back to login page from Email OTP Signup screen successfully
    Given the IAM OAuth Authorize redirects to the Login page
    And the feature flag "email_otp" is enabled
    And the User navigates to "/"
    And the User should be redirected to "/login"
    And the User clicks on the Element with Cypress ID "signup"
    And the User should be redirected to "/signup"
    And the User types "user@email.com" in Input inside Element with Cypress ID "input-signup-email"
    And the IAM POST Signup redirects to the Signup page with Success for Email "email@email.com"
    When the User clicks on the Element with Cypress ID "button-signup-submit"
    Then the Element with Cypress ID "check-your-email" should exist
    And the Element with Cypress ID "email-for-verification" should have the text as "email@email.com"
    And the User navigates to "/signup/email-otp?next_url=NEXT_URL&csrf_token=c90de3f9daf38bfcdeac7f0000d1f06491255f01&username=eben-mfa-10%40test.com"
    And the User clicks on the Element with Cypress ID "button-email-otp-back-to"
    And the User should be redirected to "/login"

  Scenario: Signup Page
    Given the IAM OAuth Authorize redirects to the Login page with sp "001"
    And the User navigates to "/"
    And the User should be redirected to "/login"
    When the User clicks on the Element with Cypress ID "signup"
    Then the User should be redirected to "/signup"
    And the Element with Cypress ID "continue-with-google" should be visible
    And the Element with Cypress ID "continue-with-microsoft" should be visible
    And the Element with Cypress ID "input-signup-email" should be visible
    And the Element with Cypress ID "button-signup-submit" should be visible
    Then the Element with Cypress ID "button-signup-submit" should have the color "rgb(226, 60, 157)"
    Then the Element with Cypress ID "button-signup-submit" should have the text color "rgb(255, 255, 255)"

  Scenario: Signup Page with default settings for button and logo
    Given the IAM OAuth Authorize redirects to the Login page with sp "002"
    And the User navigates to "/"
    And the User should be redirected to "/login"
    When the User clicks on the Element with Cypress ID "signup"
    Then the User should be redirected to "/signup"
    Then the Element with Cypress ID "button-signup-submit" should have the color "rgb(7, 46, 81)"
    Then the Element with Cypress ID "button-signup-submit" should have the text color "rgb(255, 255, 255)"

  Scenario: Sign Up with Google
    Given the IAM OAuth Authorize redirects to the Login page
    And the User navigates to "/"
    And the User should be redirected to "/login"
    And the User clicks on the Element with Cypress ID "signup"
    And the User should be redirected to "/signup"
    And the Element with Cypress ID "continue-with-google" should exist
    And the IAM Login with Google has been intercepted
    When the User clicks on the Element with Cypress ID "continue-with-google"
    Then the User should be redirected to the IAM Login with Google page

  Scenario: Sign Up with Microsoft
    Given the IAM OAuth Authorize redirects to the Login page
    And the User navigates to "/"
    And the User should be redirected to "/login"
    And the User clicks on the Element with Cypress ID "signup"
    And the User should be redirected to "/signup"
    And the Element with Cypress ID "continue-with-microsoft" should exist
    And the IAM Login with Microsoft has been intercepted
    When the User clicks on the Element with Cypress ID "continue-with-microsoft"
    Then the User should be redirected to the IAM Login with Microsoft page

  Scenario: Email is associated with an existing User or Signup
    Given the IAM OAuth Authorize redirects to the Login page
    And the User navigates to "/"
    And the User should be redirected to "/login"
    And the User clicks on the Element with Cypress ID "signup"
    And the User should be redirected to "/signup"
    And the User types "email@email.com" in Input inside Element with Cypress ID "input-signup-email"
    And the IAM POST Signup redirects to the Signup page with Error "DUPLICATE_USER_OR_SIGNUP" and Description "Email is associated with an existing User or Signup"
    When the User clicks on the Element with Cypress ID "button-signup-submit"
    Then the Element with Cypress ID "signup-form-alert" should exist
    And the Element with Cypress ID "signup-form-alert" should have the text as "Your e-mail address is already associated with an account. Login now."

  Scenario: Email Address is invalid
    Given the IAM OAuth Authorize redirects to the Login page
    And the User navigates to "/"
    And the User should be redirected to "/login"
    And the User clicks on the Element with Cypress ID "signup"
    And the User should be redirected to "/signup"
    And the User types "email@email" in Input inside Element with Cypress ID "input-signup-email"
    When the User clicks outside
    Then the Element with Cypress ID "input-signup-email" should have a Form Error for validator "email" with text "Please enter a valid email address"

  Scenario: Email Address is required with sp configs
    Given the IAM OAuth Authorize redirects to the Login page with sp "001"
    And the User navigates to "/"
    And the User should be redirected to "/login"
    And the User clicks on the Element with Cypress ID "signup"
    And the User should be redirected to "/signup"
    And the User types "email@email.com" in Input inside Element with Cypress ID "input-signup-email"
    And the User clears the Input inside Element with Cypress ID "input-signup-email"
    When the User clicks outside
    Then the Element with Cypress ID "button-signup-submit" should have the color "rgb(226, 60, 157)"
    Then the Element with Cypress ID "button-signup-submit" should have the text color "rgb(255, 255, 255)"
    Then the Element with Cypress ID "input-signup-email" should have a Form Error for validator "required" with text "Email address is required"

  Scenario: User should see the "check your email" message after successful signup
    Given the IAM OAuth Authorize redirects to the Login page
    And the User navigates to "/"
    And the User should be redirected to "/login"
    And the User clicks on the Element with Cypress ID "signup"
    And the User should be redirected to "/signup"
    And the User types "email@email.com" in Input inside Element with Cypress ID "input-signup-email"
    And the IAM POST Signup redirects to the Signup page with Success for Email "email@email.com"
    When the User clicks on the Element with Cypress ID "button-signup-submit"
    Then the Element with Cypress ID "check-your-email" should exist
    And the Element with Cypress ID "email-for-verification" should have the text as "email@email.com"

  Scenario: Signup with Error External Access Denied
    When the User navigates to "/signup?error=external_access_denied"
    Then the User should be redirected to "/signup?error=external_access_denied"
    And the Element with Cypress ID "signup-form-alert" contains the text as "Access denied by User"

  Scenario: Signup with Error Signup Required
    When the User navigates to "/signup?error=SignupRequired"
    Then the User should be redirected to "/signup?error=SignupRequired"
    And the Element with Cypress ID "signup-form-alert" contains the text as "You need to signup before"

  Scenario: Signup with Email in Params should show prefilled Email
    Given the IAM OAuth Authorize redirects to the Signup page
    When the User navigates to "/signup?next_url=NEXT_URL&csrf_TOKEN=CSRF_TOKEN&username=user@example.com"
    Then the User should be redirected to "/signup?next_url"
    And the Input inside Element with Cypress ID "input-signup-email" should have the value as "user@example.com"

  Scenario: Signup without Next URL should be redirected to Signup with Next URL
    Given the IAM OAuth Authorize redirects to the Signup page
    When the User navigates to "/signup"
    Then the User should be redirected to "/signup?next_url"

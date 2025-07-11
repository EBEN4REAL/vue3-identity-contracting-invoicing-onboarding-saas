Feature: Access Management - User - Details - Web Authentication

  Scenario: Button Setup Web Authentication should NOT exist if user has no password
    Given the User "003" is Signed In
    And the feature flag "webauthn" is enabled
    And the IAM User @me request has been intercepted to return the User "003"
    And the IAM User @me request has been intercepted to return the User "003-without-password"
    When the User navigates to "/user/security"
    Then the Element with Cypress ID "button-setup-web-authentication" should NOT exist

  Scenario: Should be able to reset already configured Webauthn credentials
    Given the User "003" is Signed In
    And the feature flag "webauthn" is enabled
    And the IAM User @me request has been intercepted to return the User "005"
    And the IAM GET User @me Webathn setup request has been intercepted to return confirmed Webauthn details with Id "002-webauthnsetup-confirmed"
    And the User navigates to "/user/security"
    And the IAM GET User @me Webauthn setup info request has been completed
    When the User clicks on the Element with Cypress ID "button-reset-web-authentication"
    And the IAM DELETE User @me Webauthn request has been intercepted to reset Webauthn
    And the User clicks on the Element with Cypress ID "dialog-confirm-reset-web-authentication button-submit"
    And the IAM DELETE User @me Webauthn reset request has been completed
    Then the Element with Cypress ID "dialog-confirm-reset-web-authentication" should NOT exist    
    
  Scenario: Should be able to setup Web Authentication successfully
    Given the User "005" is Signed In
    And the feature flag "webauthn" is enabled
    And the IAM User @me request has been intercepted to return the User "005"
    And the IAM GET User @me Webathn request has been intercepted to return 404
    And the User navigates to "/user/security"
    When the User clicks on the Element with Cypress ID "button-setup-web-authentication"
    And the User types "somepassword" in Input inside Element with Cypress ID "webauthn-password"
    And the IAM POST User @me Webauthn request has been intercepted to return webauthn options "eyJycCI6IHsibmFtZSI6ICJBY21lIEluYy4iLCAiaWQiOiAibG9jYWxob3N0In0sICJ1c2VyIjogeyJpZCI6ICJ4Y1dqMVFTQ1ZsWVhkTEZoMlJIZjFoLU93UmFGWTNXTXNJWjNNZ0psR3JBUWlXNVdjLUF2WFY2QkdHMmo0a2pySHljUk1pVDJsWk1jXzZPaE9nRVVLQSIsICJuYW1lIjogImViZW4rd2ViYXV0aCsxNUB0ZXN0LmNvbSIsICJkaXNwbGF5TmFtZSI6ICJlYmVuK3dlYmF1dGgrMTVAdGVzdC5jb20ifSwgImNoYWxsZW5nZSI6ICJlSVZwZHV2YVBGNTBtZUxOQTE4NHhzbEt2dG5mM0lXak9tOHVMaHNPd0RxaFMxV3JjaUdteUdLd2hjQlZnclFHcHBuTmNFRzN2d2FZaE0zUGo5NDN2USIsICJwdWJLZXlDcmVkUGFyYW1zIjogW3sidHlwZSI6ICJwdWJsaWMta2V5IiwgImFsZyI6IC03fSwgeyJ0eXBlIjogInB1YmxpYy1rZXkiLCAiYWxnIjogLTh9LCB7InR5cGUiOiAicHVibGljLWtleSIsICJhbGciOiAtMzZ9LCB7InR5cGUiOiAicHVibGljLWtleSIsICJhbGciOiAtMzd9LCB7InR5cGUiOiAicHVibGljLWtleSIsICJhbGciOiAtMzh9LCB7InR5cGUiOiAicHVibGljLWtleSIsICJhbGciOiAtMzl9LCB7InR5cGUiOiAicHVibGljLWtleSIsICJhbGciOiAtMjU3fSwgeyJ0eXBlIjogInB1YmxpYy1rZXkiLCAiYWxnIjogLTI1OH0sIHsidHlwZSI6ICJwdWJsaWMta2V5IiwgImFsZyI6IC0yNTl9XSwgInRpbWVvdXQiOiA2MDAwMCwgImV4Y2x1ZGVDcmVkZW50aWFscyI6IFtdLCAiYXV0aGVudGljYXRvclNlbGVjdGlvbiI6IHsicmVxdWlyZVJlc2lkZW50S2V5IjogZmFsc2UsICJ1c2VyVmVyaWZpY2F0aW9uIjogInJlcXVpcmVkIn0sICJhdHRlc3RhdGlvbiI6ICJub25lIn0"
    And the IAM PUT User @me Webauthn setup request has been intercepted to verify and complete Webauthn setup with WebauthnCredentialId "002-webauthnsetup-confirmed"
    And the User successfully validates on webauthn after clicking the button with Cypress ID "button-continue-web-authentication-setup" with mock response "001-webauthn-credential" and parsed options "003-webauth-registration-response"
    And the User clicks on the Element with Cypress ID "button-continue-web-authentication-setup" 
    And the IAM POST User @me Webauthn request has been completed


    
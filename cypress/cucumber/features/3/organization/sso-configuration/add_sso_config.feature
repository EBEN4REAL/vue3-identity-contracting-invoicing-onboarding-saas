Feature: Organization SSO Configuration - Create

  Scenario: Should show Organization SSO Form Validation Errors successfully

    Given the User "003" is Signed In
    And the feature flag "sso" is enabled
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the Iam Organizations OIDC request has been intercepted to return no SSO Config for Organization "001"
    And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the IAM Organization OIDC request to return no SSO Configuration has been completed
    And the Element with Cypress ID "button-add-sso-config" should be visible
    When the User clicks on the Element with Cypress ID "button-add-sso-config"
    And the User clicks on the Element with Cypress ID "button-save-sso-config"
    Then the Element with Cypress ID "sso-config-client-id" should have a class "mm-input-error"
    And the Element with Cypress ID "sso-config-client-secret" should have a class "mm-input-error"
    And the Element with Cypress ID "sso-config-server-metadata-url" should have a class "mm-input-error"

 Scenario: Should Add Organization SSO Configuration Successfully

    Given the User "003" is Signed In
    And the feature flag "sso" is enabled
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Element with Cypress ID "button-add-sso-config" should be visible
    When the User clicks on the Element with Cypress ID "button-add-sso-config"
    And the User enters text "qQxcEkIBM3LubtAgkkVLBKhPmEhOkVfe" in Input inside Element with Cypress ID "sso-config-client-id"
    And the User types "Ba993evc3vak9wjb9O41uQf5nLMdaGl3cxjwT9QxVDjElmuAAGv3AS0MlEzkpFl9" in the Element with Cypress ID "sso-config-client-secret"
    And the User enters text "https://dev-mp5y3htk6v3y0llv.eu.auth0.com/.well-known/openid-configuration" in Input inside Element with Cypress ID "sso-config-server-metadata-url"
    And the Iam Organizations OIDC request has been intercepted to add SSO Config "001" for Organization "001"
    And the Iam Organizations OIDC request has been intercepted to return SSO Config "001-sso-enabled" for Organization "001"
    And the User clicks on the Element with Cypress ID "button-save-sso-config"
    Then the IAM Organization OIDC request to add SSO Configuration should have been completed
    And the IAM Organization OIDC request to get SSO Configuration has been completed
    And the Input with Cypress ID "sso-configuration-dialog sso-config-callback_url" should have value as "http://localhost/login-sso-callback"
    And the Input with Cypress ID "sso-configuration-dialog sso-config-authorization_endpoint" should have value as "http://localhost/oauth2/authorize"
    And the Input with Cypress ID "sso-configuration-dialog sso-config-end_session_endpoint" should have value as "http://localhost/oauth2/logout"

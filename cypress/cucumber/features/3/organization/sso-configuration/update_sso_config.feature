Feature: Organization SSO Configuration - Update

    Scenario: Should update Organization SSO Configuration Successfully

        Given the User "003" is Signed In
        And the feature flag "sso" is enabled
        And the IAM Organization request has been intercepted to return the Organization "001"
        And the Iam Organizations OIDC request has been intercepted to return SSO Config "001-sso-enabled" for Organization "001"
        And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
        And the IAM Organization OIDC request to get SSO Configuration has been completed
        When the User clicks on the Element with Cypress ID "button-edit-sso-config"
        And the User enters text "qQxcEkIBM3LubtAgkkVLBKhPmEhOkVfe" in Input inside Element with Cypress ID "sso-config-client-id"
        And the User types "Ba993evc3vak9wjb9O41uQf5nLMdaGl3cxjwT9QxVDjElmuAAGv3AS0MlEzkpFl9" in the Element with Cypress ID "sso-config-client-secret"
        And the User enters text "https://dev-mp5y3htk6v3y0llv.eu.auth0.com/.well-known/openid-configuration" in Input inside Element with Cypress ID "sso-config-server-metadata-url"
        And the Iam Organizations OIDC request has been intercepted to update SSO Config "001" for Organization "001"
        And the User clicks on the Element with Cypress ID "button-save-sso-config"
        Then the IAM Organization OIDC request to update SSO Configuration should have been completed
        And the Element with Cypress ID "sso-configuration-dialog" should NOT exist
    
    Scenario: Should be able to enable Organization SSO Configuration Successfully

        Given the User "003" is Signed In
        And the feature flag "sso" is enabled
        And the IAM Organization request has been intercepted to return the Organization "001"
        And the Iam Organizations OIDC request has been intercepted to return SSO Config "001-sso-disabled" for Organization "001"
        And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
        And the IAM Organization OIDC request to get SSO Configuration has been completed
        And the Iam Organizations OIDC request has been intercepted to update SSO Config "001" for Organization "001"
        When the User clicks on the Element with Cypress ID "button-enable-sso-config"
        Then the IAM Organization OIDC request to update SSO Configuration should have been completed
    
    Scenario: Should be able to disable Organization SSO Configuration Successfully

        Given the User "003" is Signed In
        And the IAM Organization request has been intercepted to return the Organization "001"
        And the Iam Organizations OIDC request has been intercepted to return SSO Config "001-sso-enabled" for Organization "001"
        And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
        And the IAM Organization OIDC request to get SSO Configuration has been completed
        And the Iam Organizations OIDC request has been intercepted to update SSO Config "001" for Organization "001"
        When the User clicks on the Element with Cypress ID "button-disable-sso-config"
        Then the IAM Organization OIDC request to update SSO Configuration should have been completed
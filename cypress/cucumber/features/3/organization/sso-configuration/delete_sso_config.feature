Feature: Organization SSO Configuration - Delete

    Scenario: Should successfully remove Organization SSO Configuration

        Given the User "003" is Signed In
        And the feature flag "sso" is enabled
        And the IAM Organization request has been intercepted to return the Organization "001"
        And the Iam Organizations OIDC request has been intercepted to return SSO Config "001-sso-enabled" for Organization "001"
        And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
        And the IAM Organization OIDC request to get SSO Configuration has been completed
        And the the IAM  Organization OIDC request to remove SSO configuration has been intercepted for Organization "001"
        When the User clicks on the Element with Cypress ID "button-remove-sso-config"
        Then the IAM Organization OIDC request to remove SSO Configuration should have been completed 
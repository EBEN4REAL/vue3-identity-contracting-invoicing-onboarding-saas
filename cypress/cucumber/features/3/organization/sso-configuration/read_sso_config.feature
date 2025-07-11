Feature: Organization SSO Configuration - Read

  Scenario: Should show Organization SSO Configuration component successfully

    Given the User "003" is Signed In
    And the feature flag "sso" is enabled
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the Iam Organizations OIDC request has been intercepted to return SSO Config "001-sso-enabled" for Organization "001"
    When the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the IAM Organization OIDC request to get SSO Configuration has been completed
    Then the Element with Cypress ID "organization-sso-config" should be visible
 
 Scenario: Should show Add SSO button for Organization without SSO Configuration

    Given the User "003" is Signed In
    And the feature flag "sso" is enabled
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the Iam Organizations OIDC request has been intercepted to return no SSO Config for Organization "001"
    When the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the IAM Organization OIDC request to return no SSO Configuration has been completed
    Then the Element with Cypress ID "button-add-sso-config" should be visible

 Scenario: Should show Edit SSO, Disable SSO and Remove SSO buttons for Organization wih SSO Enabled Configuration

    Given the User "003" is Signed In
    And the feature flag "sso" is enabled
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the Iam Organizations OIDC request has been intercepted to return SSO Config "001-sso-enabled" for Organization "001"
    When the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the IAM Organization OIDC request to get SSO Configuration has been completed
    Then the Element with Cypress ID "button-edit-sso-config" should be visible
    And the Element with Cypress ID "button-disable-sso-config" should be visible
    And the Element with Cypress ID "button-remove-sso-config" should be visible

Scenario: Should show Edit SSO, Enable SSO and Remove SSO buttons for Organization wih Disabled SSO Configuration

    Given the User "003" is Signed In
    And the feature flag "sso" is enabled
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the Iam Organizations OIDC request has been intercepted to return SSO Config "001-sso-disabled" for Organization "001"
    When the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the IAM Organization OIDC request to get SSO Configuration has been completed
    Then the Element with Cypress ID "button-edit-sso-config" should be visible
    And the Element with Cypress ID "button-enable-sso-config" should be visible
    And the Element with Cypress ID "button-remove-sso-config" should be visible

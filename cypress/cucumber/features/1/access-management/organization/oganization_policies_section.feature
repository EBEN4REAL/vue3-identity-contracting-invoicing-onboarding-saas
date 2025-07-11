Feature: Organization - Policies Section in Access Tab

   Background:
     Given the User "003" is Signed In
     And the IAM User @me request has been intercepted to return the User "003"
     And the IAM Organization request has been intercepted to return the Organization "001"
     And the Onboarding GET Consents "001" for Organization "001" request has been intercepted
     And the Iam Organizations OIDC request has been intercepted to return SSO Config "001-sso-enabled" for Organization "001"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&sort=agreement_type.name:asc&cancelled=false&assigned_own_organization=true&category=ACCESS"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&cancelled=false&category=ACCESS"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&sort=agreement_type.name:asc&cancelled=false&assigned_own_organization=true&category=SUBSCRIPTION"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&cancelled=false&category=SUBSCRIPTION"

   Scenario: Organization Policies Table should exist and have the right content
    And the Service Consumers Policies request has been intercepted to return the Org PolicyType "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the IAM Organization request has been intercepted to return the Organization "001" for SP "0edfc35c-e116-4c2e-8e35-8a28b68d5f6d"
    When the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User clicks on the Element with Cypress ID "tab-item-access"
    Then the Element with Cypress ID "policies-table" should exist
    And the Element with Cypress ID "policy-name-3fa85f64-5717-4562-b3fc-2c963f66afa6" should have the text as "Policy name"
    And the Element with Cypress ID "policy-organization-name-3fa85f64-5717-4562-b3fc-2c963f66afa6" should have the text as "Org 001"

   Scenario: Organization Policies Table with no results
    And the Service Consumers Policies request has been intercepted to return the Org PolicyType "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the IAM Organization request has been intercepted to return the Organization "001" for SP "0edfc35c-e116-4c2e-8e35-8a28b68d5f6d"
    When the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User clicks on the Element with Cypress ID "tab-item-access"
    Then the Element with Cypress ID "policies-table" should exist
    And the Element with Cypress ID "table-empty-state" should exist
    And the Element with Cypress ID "table-empty-state" contains the text as "No policies"
    
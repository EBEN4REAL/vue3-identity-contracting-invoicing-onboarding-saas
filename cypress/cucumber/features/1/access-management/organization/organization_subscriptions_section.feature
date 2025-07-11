Feature: Access Management - Organization - Subscriptions Section in Access Tab

   Background: Access Management - Organization - Subscriptions Section in Access Tab
    Given the User "003" is Signed In
    And the IAM User @me request has been intercepted to return the User "003"
    And the IAM User request has been intercepted to return the User "003"
    And the Iam Organizations OIDC request has been intercepted to return SSO Config "001-sso-enabled" for Organization "001"
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization request has been intercepted to return Service Providers "001" from Organization "001"
    And the IAM Organization request has been intercepted to return the Organization "001" for SP "0edfc35c-e116-4c2e-8e35-8a28b68d5f6d"
    And the Onboarding GET Consents "001" for Organization "001" request has been intercepted
    And the Suborganizations request has been intercepted to return the Suborganizations "002" for Organization "001"
    And the Service Consumers Policies request has been intercepted to return the Org PolicyType "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"

   Scenario: Organization Subscriptions Table should exist and have the right content
    And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "002,001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    When the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User clicks on the Element with Cypress ID "tab-item-access"
    Then the Element with Cypress ID "org-subscriptions-table" should exist
    And the Element with Cypress ID "org-subscriptions-table page-subtitle" should have the text as "All subscriptions assigned to the entire organization."
    And the Element with Cypress ID "column-subscriptions-name-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a2" should have the text as "Service provider 2"

   Scenario: Successfully disable the assign subscription button in the organization details subscriptions tab if there are no subscriptions to be assigned
      And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
      And the IAM Organization User request has been intercepted to return the User "002" from Organization "001"
      And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001,002" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&sort=agreement_type.name:asc&cancelled=false&assigned_own_organization=true&category=ACCESS"
      And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&sort=agreement_type.name:asc&cancelled=false&assigned_own_organization=true&category=SUBSCRIPTION"
      When the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
      And the Policies Service Agreements request has been intercepted to return no Licenses from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "&category=SUBSCRIPTION"
      And the User clicks on the Element with Cypress ID "tab-item-access"
      And the policies service agreements request have been completed successfully
      Then the Element with Cypress ID "assign-subscription-button" should be disabled 

   Scenario: Successfully assign subscription to Organization and disable subscription which have already been assigned to the Organization in Autocomplete dropdown
     And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
     And the IAM Organization User request has been intercepted to return the User "002" from Organization "001"
     And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001,002,003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001,002" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "assigned_own_organization=true"
     When the User clicks on the Element with Cypress ID "tab-item-access"
     And the User clicks on the Element with Cypress ID "assign-subscription-button"
     Then the Element with Cypress ID "assign-subscription-dialog" should exist
     And the Element with Cypress ID "dialog-title" should have the text as "Add Subscription to Org 001" 
     And the Element with Cypress ID "assign-subscription-to-org-submit-button" should have the text as " Add Subscription"
     And the User clicks on the Element with Cypress ID "assign-subscription-to-organization-autocomplete autocomplete"
     And the Element with Cypress ID "mm-autocomplete-option-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1" should have a class "mm-autocomplete-option--disabled"
     And the User clicks on the Element with Cypress ID "mm-autocomplete-option-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a3"
     And the Policies Service Consumers Agreements request has been intercepted to assign the License "86678c73-b72a-4c8e-9dca-0bf5d1a1c6a3" to Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001,002,003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the User clicks on the Element with Cypress ID "assign-subscription-to-org-submit-button"
     Then the Element with Cypress ID "column-licenses-name-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a3" should have the text as "Service provider 3"

   Scenario: Successfully sort by subscription name
     And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
     And the IAM Organization User request has been intercepted to return the User "002" from Organization "001"
     And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001,002,003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001,002" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "sort=agreement_type.name:asc&cancelled=false&assigned_own_organization=true"
     When the User clicks on the Element with Cypress ID "tab-item-access"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "002,001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "&sort=agreement_type.name:asc&cancelled=false&assigned_own_organization=true"
     When the User clicks on the Element with Cypress ID "org-subscriptions-table sort-icon-agreement_type_name"
     Then the Element with Cypress ID "org-subscriptions-table sort-icon-agreement_type_name" should NOT have a class "mm-table-header-cell--icon-focused"

   Scenario: Successfully remove subscription to Organization
     And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
     And the IAM Organization User request has been intercepted to return the User "002" from Organization "001"
     When the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "002" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "002,003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" without query params
     And the User clicks on the Element with Cypress ID "tab-item-access"
     And the User clicks on the Element with Cypress ID "org-subscriptions-table actions-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a2"
     And the User clicks on the Element with Cypress ID "actions-dropdown-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a2-item-remove-subscription"
     And the Policies Service Consumers Agreements request has been intercepted to unassign the License "86678c73-b72a-4c8e-9dca-0bf5d1a1c6a2" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     Then the User clicks on the Element with Cypress ID "button-confirm-unassign"
     And the Element with Cypress ID "org-subscriptions-table row-1" should NOT exist

   Scenario: Successfully go to Subscriptions Details
     And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
     And the IAM Organization User request has been intercepted to return the User "002" from Organization "001"
     When the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "002" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "002,003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" without query params
     And the User clicks on the Element with Cypress ID "tab-item-access"
     And the User clicks on the Element with Cypress ID "org-subscriptions-table column-subscriptions-name-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a2"
     Then the User should be redirected to "sc/subscriptions/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a2"

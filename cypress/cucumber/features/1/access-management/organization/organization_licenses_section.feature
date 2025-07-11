Feature: Access Management - Organization - Licenses Section in Access Tab

   Background:
    Given the User "003" is Signed In
    And the IAM User @me request has been intercepted to return the User "003"
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the Onboarding GET Consents "001" for Organization "001" request has been intercepted
    And the Suborganizations request has been intercepted to return the Suborganizations "002" for Organization "001"

   Scenario: Organization Licenses Table should exist and have the right content
    And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "002,001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    When the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User clicks on the Element with Cypress ID "tab-item-access"
    Then the Element with Cypress ID "licenses-table" should exist
    And the Element with Cypress ID "licenses-table page-subtitle" should have the text as "All licenses assigned to the entire organization."
    And the Element with Cypress ID "column-licenses-name-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a2" should have the text as "Service provider 2"

   Scenario: Successfully disable the assign license button in the organization details licenses tab if there are no licenses to be assigned
      And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
      And the IAM Organization User request has been intercepted to return the User "002" from Organization "001"
      When the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
      And the Policies Service Agreements request has been intercepted to return no Licenses from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "&category=ACCESS"
      And the User clicks on the Element with Cypress ID "tab-item-access"
      And the policies service agreements request have been completed successfully
      Then the Element with Cypress ID "assign-license-button" should be disabled 

   Scenario: Successfully assign license to Organization and disable license which have already been assigned to the Organization in Autocomplete dropdown
     And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
     And the IAM Organization User request has been intercepted to return the User "002" from Organization "001"
     And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001,002,003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001,002" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "assigned_own_organization=true"
     When the User clicks on the Element with Cypress ID "tab-item-access"
     And the User clicks on the Element with Cypress ID "assign-license-button"
     Then the Element with Cypress ID "assign-license-dialog" should exist
     Then the Element with Cypress ID "dialog-title" should have the text as "Add License to Org 001" 
     And the Element with Cypress ID "assign-license-to-org-submit-button" should have the text as " Add License" 
     And the User clicks on the Element with Cypress ID "assign-license-to-organization-autocomplete autocomplete"
     And the Element with Cypress ID "mm-autocomplete-option-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1" should have a class "mm-autocomplete-option--disabled"
     And the User clicks on the Element with Cypress ID "mm-autocomplete-option-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a3"
     And the Policies Service Consumers Agreements request has been intercepted to assign the License "86678c73-b72a-4c8e-9dca-0bf5d1a1c6a3" to Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001,002,003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the User clicks on the Element with Cypress ID "assign-license-to-org-submit-button"
     Then the Element with Cypress ID "column-licenses-name-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a3" should have the text as "Service provider 3"

   Scenario: Successfully sort by license name
     And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
     And the IAM Organization User request has been intercepted to return the User "002" from Organization "001"
     And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001,002,003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001,002" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "sort=agreement_type.name:asc&cancelled=false&assigned_own_organization=true"
     When the User clicks on the Element with Cypress ID "tab-item-access"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "002,001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "&sort=agreement_type.name:asc&cancelled=false&assigned_own_organization=true"
     When the User clicks on the Element with Cypress ID "licenses-table sort-icon-agreement_type_name"
     Then the Element with Cypress ID "licenses-table sort-icon-agreement_type_name" should NOT have a class "mm-table-header-cell--icon-focused"

   Scenario: Successfully remove license to Organization
     And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
     And the IAM Organization User request has been intercepted to return the User "002" from Organization "001"
     When the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "002" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "002,003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" without query params
     And the User clicks on the Element with Cypress ID "tab-item-access"
     And the User clicks on the Element with Cypress ID "licenses-table actions-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a2"
     And the User clicks on the Element with Cypress ID "actions-dropdown-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a2-item-remove-license"
     And the Policies Service Consumers Agreements request has been intercepted to unassign the License "86678c73-b72a-4c8e-9dca-0bf5d1a1c6a2" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     Then the User clicks on the Element with Cypress ID "button-confirm-unassign"
     And the Element with Cypress ID "licenses-table row-1" should NOT exist

   Scenario: Successfully go to License Details
     And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
     And the IAM Organization User request has been intercepted to return the User "002" from Organization "001"
     When the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "002" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "002,003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" without query params
     And the User clicks on the Element with Cypress ID "tab-item-access"
     And the User clicks on the Element with Cypress ID "licenses-table column-licenses-name-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a2"
     Then the User should be redirected to "sc/access-licenses/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a2"

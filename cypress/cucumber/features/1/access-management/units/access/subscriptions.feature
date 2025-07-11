Feature: Access Management - Units - Subscription Agreements

   Background:
    Given the User "003" is Signed In
    And the IAM User @me request has been intercepted to return the User "003"
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"

   Scenario: Organization Unit Subscriptions Table should exist and have the right content
     When the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&sort=agreement_type_name:asc&assigned_organization_unit_id=01234567-89ab-cdef-0123-456789abcdef&category=ACCESS"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&cancelled=false&category=ACCESS"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&sort=agreement_type_name:asc&assigned_organization_unit_id=01234567-89ab-cdef-0123-456789abcdef&category=SUBSCRIPTION"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&cancelled=false&category=SUBSCRIPTION"
     Then the User clicks on the Element with Cypress ID "tab-item-access"
     And the Element with Cypress ID "subscriptions-table page-subtitle" should have the text as "All Subscriptions directly assigned to this unit."
     And the Element with Cypress ID "subscriptions-table" should exist
     And the Element with Cypress ID "subscriptions-table agreement_type_name" should have the text as "Service provider 3"

   Scenario: Successfully disable assign subscription button in the organization unit details subscriptions tab if there are no subscriptions to be assigned
     When the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&sort=agreement_type_name:asc&assigned_organization_unit_id=01234567-89ab-cdef-0123-456789abcdef&category=ACCESS"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&cancelled=false&category=ACCESS"
     And the Policies Service Agreements request has been intercepted to return no Licenses from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "&category=SUBSCRIPTION"
     When the User clicks on the Element with Cypress ID "tab-item-access"
     Then the Element with Cypress ID "assign-subscription-button" should be disabled 

   Scenario: Successfully assign subscription to Organization unit and disable already assigned subscriptions in Autocomplete dropdown
     And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001,002" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&sort=agreement_type_name:asc&assigned_organization_unit_id=01234567-89ab-cdef-0123-456789abcdef&category=ACCESS"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&cancelled=false&category=ACCESS"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "004" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&sort=agreement_type_name:asc&assigned_organization_unit_id=01234567-89ab-cdef-0123-456789abcdef&category=SUBSCRIPTION"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&cancelled=false&category=SUBSCRIPTION"
     When the User clicks on the Element with Cypress ID "tab-item-access"
     And the User clicks on the Element with Cypress ID "assign-subscription-button"
     And the User clicks on the Element with Cypress ID "assign-subscription-to-unit-autocomplete autocomplete"
     And the User clicks on the Element with Cypress ID "mm-autocomplete-option-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a3"
     And the Policies Service Consumers Agreements request has been intercepted to assign the License "86678c73-b72a-4c8e-9dca-0bf5d1a1c6a3" to Organization Unit "01234567-89ab-cdef-0123-456789abcdef" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&sort=agreement_type_name:asc&assigned_organization_unit_id=01234567-89ab-cdef-0123-456789abcdef&category=SUBSCRIPTION"
     And the User clicks on the Element with Cypress ID "assign-subscription-to-org-unit-submit-button"
     Then the Element with Cypress ID "subscriptions-table row-0 agreement_type_name" should have the text as "Service provider 3"

   Scenario: Organization Units subscriptions table should display Manage Optional Policies for subscriptions with optional policies
     And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&sort=agreement_type_name:asc&assigned_organization_unit_id=01234567-89ab-cdef-0123-456789abcdef&category=ACCESS"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&cancelled=false&category=ACCESS"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&sort=agreement_type_name:asc&assigned_organization_unit_id=01234567-89ab-cdef-0123-456789abcdef&category=SUBSCRIPTION"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&cancelled=false&category=SUBSCRIPTION"
     And the User clicks on the Element with Cypress ID "tab-item-access"
     When the User clicks on the Element with Cypress ID "subscriptions-table actions-button-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a3"
     Then the Element with Cypress ID "dropdown-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a3-item-manage-optional-policies" should be visible
     And the Element with Cypress ID "dropdown-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a3-item-manage-optional-policies" contains the text as "Manage Optional Policies"

   Scenario: Successfully remove subscriptiom from org unit
     When the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "002" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&sort=agreement_type_name:asc&assigned_organization_unit_id=01234567-89ab-cdef-0123-456789abcdef&category=ACCESS"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "002" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&cancelled=false&category=ACCESS"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "003,004" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&sort=agreement_type_name:asc&assigned_organization_unit_id=01234567-89ab-cdef-0123-456789abcdef&category=SUBSCRIPTION"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&cancelled=false&category=SUBSCRIPTION"
     And the User clicks on the Element with Cypress ID "tab-item-access"
     And the User clicks on the Element with Cypress ID "subscriptions-table actions-button-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a3"
     And the User clicks on the Element with Cypress ID "dropdown-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a3-item-remove-subscription"
     And the Policies Service Consumers Agreements request has been intercepted to unassign the License "86678c73-b72a-4c8e-9dca-0bf5d1a1c6a3" from the Organization Unit "01234567-89ab-cdef-0123-456789abcdef" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "004" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&sort=agreement_type_name:asc&assigned_organization_unit_id=01234567-89ab-cdef-0123-456789abcdef&category=SUBSCRIPTION"
     And the Element with Cypress ID "dialog-subtitle" contains the text as "Are you sure you want to remove this subscription assigned to Unit 1?"
     And the User clicks on the Element with Cypress ID "button-confirm-unassign"
     And the Policies Service Consumers Agreements request has been completed to unassign the License
     Then the Element with Cypress ID "subscriptions-table row-0 agreement_type_name" should have the text as "Service provider 4"

   Scenario: Successfully sort by subscription name
     When the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001,002" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&sort=agreement_type_name:asc&assigned_organization_unit_id=01234567-89ab-cdef-0123-456789abcdef&category=ACCESS"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "002" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&cancelled=false&category=ACCESS"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "003,004" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&sort=agreement_type_name:asc&assigned_organization_unit_id=01234567-89ab-cdef-0123-456789abcdef&category=SUBSCRIPTION"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&cancelled=false&category=SUBSCRIPTION"
     And the User clicks on the Element with Cypress ID "tab-item-access"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "004,003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&sort=agreement_type_name:desc&assigned_organization_unit_id=01234567-89ab-cdef-0123-456789abcdef&category=SUBSCRIPTION"
     And the User clicks on the Element with Cypress ID "subscriptions-table sort-icon-agreement_type_name"
     Then the Element with Cypress ID "subscriptions-table sort-icon-agreement_type_name" should NOT have a class "mm-table-header-cell--icon-focused"
     And the Element with Cypress ID "subscriptions-table row-0 agreement_type_name" should have the text as "Service provider 4"

   Scenario: Successfully redirect to subscription details page
     When the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&sort=agreement_type_name:asc&assigned_organization_unit_id=01234567-89ab-cdef-0123-456789abcdef&category=ACCESS"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&cancelled=false&category=ACCESS"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&sort=agreement_type_name:asc&assigned_organization_unit_id=01234567-89ab-cdef-0123-456789abcdef&category=SUBSCRIPTION"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&cancelled=false&category=SUBSCRIPTION"
     And the User clicks on the Element with Cypress ID "tab-item-access"
     And the User clicks on the Element with Cypress ID "subscriptions-table column-name-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a3"
     Then the User should be redirected to "sc/subscriptions/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a3"
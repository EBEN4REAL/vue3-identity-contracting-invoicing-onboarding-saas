Feature: Access Management - Units - Licenses

   Background: Access Management - Units - Licenses
    Given the User "003" is Signed In
    And the IAM User @me request has been intercepted to return the User "003"
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    And the IAM Organization request has been intercepted to return the users of Unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001" with userId "001,004"

   Scenario: Organization Unit Licenses Table should exist and have the right content
     When the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&sort=agreement_type_name:asc&assigned_organization_unit_id=01234567-89ab-cdef-0123-456789abcdef&category=ACCESS"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&cancelled=false&category=ACCESS"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&sort=agreement_type_name:asc&assigned_organization_unit_id=01234567-89ab-cdef-0123-456789abcdef&category=SUBSCRIPTION"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&cancelled=false&category=SUBSCRIPTION"
     And the IAM Organization request has been intercepted to return the Organization SP "001" for user id "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the IAM Organization request has been intercepted to return the Organization SP "001" for user id "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     Then the User clicks on the Element with Cypress ID "tab-item-access"
     And the Element with Cypress ID "licenses-table page-subtitle" should have the text as "All Licenses directly assigned to this unit."
     And the Element with Cypress ID "licenses-table" should exist
     And the Element with Cypress ID "licenses-table agreement_type_name" should have the text as "Service provider 1"

   Scenario: Successfully disable assign license button in the organization unit details licenses tab if there are no licenses to be assigned
     When the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
     And the Policies Service Agreements request has been intercepted to return no Licenses from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "&category=ACCESS"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&sort=agreement_type_name:asc&assigned_organization_unit_id=01234567-89ab-cdef-0123-456789abcdef&category=SUBSCRIPTION"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&cancelled=false&category=SUBSCRIPTION"
     And the IAM Organization request has been intercepted to return the Organization SP "001" for user id "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     When the User clicks on the Element with Cypress ID "tab-item-access"
     Then the Element with Cypress ID "assign-license-button" should be disabled 

   Scenario: Successfully assign license to Organization unit and disable already assigned Licenses in Autocomplete dropdown
     And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001,002" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&sort=agreement_type_name:asc&assigned_organization_unit_id=01234567-89ab-cdef-0123-456789abcdef&category=ACCESS"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&cancelled=false&category=ACCESS"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&sort=agreement_type_name:asc&assigned_organization_unit_id=01234567-89ab-cdef-0123-456789abcdef&category=SUBSCRIPTION"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&cancelled=false&category=SUBSCRIPTION"
     And the IAM Organization request has been intercepted to return the Organization SP "001" for user id "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     When the User clicks on the Element with Cypress ID "tab-item-access"
     And the User clicks on the Element with Cypress ID "assign-license-button"
     And the User clicks on the Element with Cypress ID "assign-license-to-unit-autocomplete autocomplete"
     And the User clicks on the Element with Cypress ID "mm-autocomplete-option-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a3"
     And the Policies Service Consumers Agreements request has been intercepted to assign the License "86678c73-b72a-4c8e-9dca-0bf5d1a1c6a3" to Organization Unit "01234567-89ab-cdef-0123-456789abcdef" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&sort=agreement_type_name:asc&assigned_organization_unit_id=01234567-89ab-cdef-0123-456789abcdef&category=ACCESS"
     And the Policies Service Consumers Agreements request has been intercepted to return Policies "001" for the License "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the User clicks on the Element with Cypress ID "assign-license-to-org-unit-submit-button"
     Then the Element with Cypress ID "licenses-table row-0 agreement_type_name" should have the text as "Service provider 3"

   Scenario: Organization Units Licenses Table should display Manage Optional Policies for licenses with optional policies
     And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&sort=agreement_type_name:asc&assigned_organization_unit_id=01234567-89ab-cdef-0123-456789abcdef&category=ACCESS"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&cancelled=false&category=ACCESS"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&sort=agreement_type_name:asc&assigned_organization_unit_id=01234567-89ab-cdef-0123-456789abcdef&category=SUBSCRIPTION"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&cancelled=false&category=SUBSCRIPTION"
     And the IAM Organization request has been intercepted to return the Organization SP "001" for user id "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the User clicks on the Element with Cypress ID "tab-item-access"
     And the Policies Service Consumers Agreements request has been intercepted to return Policies "001" for the License "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     When the User clicks on the Element with Cypress ID "licenses-table actions-button-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
     Then the Element with Cypress ID "dropdown-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1-item-manage-optional-policies" should be visible
     And the Element with Cypress ID "dropdown-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1-item-manage-optional-policies" contains the text as "Manage Optional Policies"

   Scenario: Successfully remove license from org unit
     When the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "002" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&sort=agreement_type_name:asc&assigned_organization_unit_id=01234567-89ab-cdef-0123-456789abcdef&category=ACCESS"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "002" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&cancelled=false&category=ACCESS"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&sort=agreement_type_name:asc&assigned_organization_unit_id=01234567-89ab-cdef-0123-456789abcdef&category=SUBSCRIPTION"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&cancelled=false&category=SUBSCRIPTION"
     And the IAM Organization request has been intercepted to return the Organization SP "001" for user id "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the IAM Organization request has been intercepted to return the Organization SP "001" for user id "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the User clicks on the Element with Cypress ID "tab-item-access"
     And the User clicks on the Element with Cypress ID "licenses-table actions-button-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a2"
     And the User clicks on the Element with Cypress ID "dropdown-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a2-item-remove-license"
     And the Policies Service Consumers Agreements request has been intercepted to unassign the License "86678c73-b72a-4c8e-9dca-0bf5d1a1c6a2" from the Organization Unit "01234567-89ab-cdef-0123-456789abcdef" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&sort=agreement_type_name:asc&assigned_organization_unit_id=01234567-89ab-cdef-0123-456789abcdef&category=ACCESS"
     And the IAM Organization request has been intercepted to return the Organization SP "001" for user id "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the User clicks on the Element with Cypress ID "button-confirm-unassign"
     And the Policies Service Consumers Agreements request has been completed to unassign the License
     Then the Element with Cypress ID "licenses-table row-0 agreement_type_name" should have the text as "Service provider 1"

   Scenario: Successfully sort by license name
     When the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001,002" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&sort=agreement_type_name:asc&assigned_organization_unit_id=01234567-89ab-cdef-0123-456789abcdef&category=ACCESS"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "002" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&cancelled=false&category=ACCESS"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&sort=agreement_type_name:asc&assigned_organization_unit_id=01234567-89ab-cdef-0123-456789abcdef&category=SUBSCRIPTION"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&cancelled=false&category=SUBSCRIPTION"
     And the IAM Organization request has been intercepted to return the Organization SP "001" for user id "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the User clicks on the Element with Cypress ID "tab-item-access"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "002,001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&sort=agreement_type_name:desc&assigned_organization_unit_id=01234567-89ab-cdef-0123-456789abcdef&category=ACCESS"
     And the User clicks on the Element with Cypress ID "licenses-table sort-icon-agreement_type_name"
     Then the Element with Cypress ID "licenses-table sort-icon-agreement_type_name" should NOT have a class "mm-table-header-cell--icon-focused"

   Scenario: Successfully redirect to access license details page
     When the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&sort=agreement_type_name:asc&assigned_organization_unit_id=01234567-89ab-cdef-0123-456789abcdef&category=ACCESS"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&cancelled=false&category=ACCESS"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&sort=agreement_type_name:asc&assigned_organization_unit_id=01234567-89ab-cdef-0123-456789abcdef&category=SUBSCRIPTION"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?limit=10&offset=0&cancelled=false&category=SUBSCRIPTION"
     And the IAM Organization request has been intercepted to return the Organization SP "001" for user id "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the User clicks on the Element with Cypress ID "tab-item-access"
     And the User clicks on the Element with Cypress ID "licenses-table column-name-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
     Then the User should be redirected to "sc/access-licenses/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"

Feature: Service Consumer - Access Licenses

    Scenario: Access Licenses table empty
      Given the User "MMAdmin001" is Signed In
      And the IAM Users request has been intercepted to return the Users "MMAdmin001"
      And the Policies Service Consumers Agreements request has been intercepted to return NO Licenses from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
      And the User navigates to "/sc/access-licenses"
      Then the Element with Cypress ID "access-licenses table" should NOT exist
      And the Element with Cypress ID "table-empty-state" should exist
      And the Element with Cypress ID "sort-icon-agreement_type_name" should NOT exist 

    Scenario: Access Licenses table should have correct info and should sort by license name
      Given the User "MMAdmin001" is Signed In
      And the IAM Users request has been intercepted to return the Users "MMAdmin001"
      And the IAM Organization request has been intercepted to return the Organization "001" for SP "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
      And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001,002" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?category=ACCESS&limit=10&offset=0&sort=agreement_type.name:asc"
      And the User navigates to "/sc/access-licenses"
      Then the Element with Cypress ID "access-licenses-table" should exist
      And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "002,001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?category=ACCESS&limit=10&offset=0&sort=agreement_type.name:desc"
      And the User clicks on the Element with Cypress ID "sort-icon-agreement_type_name"
      Then the Element with Cypress ID "sort-icon-agreement_type_name" should NOT have a class "mm-table-header-cell--icon-focused"
      Then the Element with Cypress ID "license-name-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a2" should have the text as "Service provider 2"

    Scenario: Pagination visible
      Given the User "MMAdmin001" is Signed In
      And the IAM Users request has been intercepted to return the Users "MMAdmin001"
      And the IAM Organization request has been intercepted to return the Organization "001" for SP "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
      And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "012,013,014,015,016,017,018,019,020,021,022,023,024" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?category=ACCESS&limit=10&offset=0&sort=agreement_type.name:asc"
      And the User navigates to "/sc/access-licenses"
      Then the Element with Cypress ID "access-licenses-table" should exist
      And the Element with Cypress ID "pagination" should exist

    Scenario: Successfully redirect to detail view and go back to overview and payments and invoices sections should not appear
      Given the User "MMAdmin001" is Signed In
      And the feature flag "legal_documents" is enabled 
      And the IAM Users request has been intercepted to return the Users "MMAdmin001"
      And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with query params "?category=ACCESS&limit=10&offset=0&sort=agreement_type.name:asc"
      And the User navigates to "/sc/access-licenses"
      And the Policies Service Consumers Agreements request has been intercepted to return the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
      And the Policies Service Consumers Agreements request has been intercepted to return Organization Users "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
      And the Policies Service Consumers Agreements request has been intercepted to return Organization Groups "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
      And the Policies Service Consumers Agreements request has been intercepted to return Organization Units "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
      And the Policies Service Consumers Agreements request has been intercepted to return Policies "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
      Then the User clicks on the Element with Cypress ID "license-name-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
      Then the User should be redirected to '/sc/access-licenses/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1'
      When the User clicks on the Element with Cypress ID "back-link"
      Then the User should be redirected to "/sc/access-license"
      Then the User clicks on the Element with Cypress ID "actions-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
      And the Billing and Invoicing request has been intercepted to return the billing details for the Agreement "001" of Service Consumer "001"
      Then the User clicks on the Element with Cypress ID "actions-dropdown-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1-item-view-license"
      Then the User should be redirected to '/sc/access-licenses/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1'
      When the User clicks on the Element with Cypress ID "license-details-header-dropdown button"
      Then the Element with Cypress ID "license-details-header-dropdown-item-update-license-contact" should have the text as "Update License Contact"
      And the Element with Cypress ID "payments-expandable" should NOT exist
      And the Element with Cypress ID "invoices-expandable" should NOT exist
      And the Element with Cypress ID "legal-docs-expandable" should exist

    
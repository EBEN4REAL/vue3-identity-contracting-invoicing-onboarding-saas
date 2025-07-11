Feature: Service Consumer - Subscriptions

   Scenario: Subscriptions table empty
     Given the User "MMAdmin001" is Signed In
     And the IAM Users request has been intercepted to return the Users "MMAdmin001"
     And the Policies Service Consumers Agreements request has been intercepted to return NO Licenses from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the User navigates to "/sc/subscriptions"
     Then the Element with Cypress ID "subscriptions table" should NOT exist
     And the Element with Cypress ID "table-empty-state" should exist
     And the Element with Cypress ID "sort-icon-agreement_type_name" should NOT exist

   Scenario: Subscriptions table should have correct info and should sort by subscription name
     Given the User "MMAdmin001" is Signed In
     And the IAM Users request has been intercepted to return the Users "MMAdmin001"
     And the IAM Organization request has been intercepted to return the Organization "001" for SP "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001,002" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the User navigates to "/sc/subscriptions"
     Then the Element with Cypress ID "subscriptions-table" should exist
     And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "002,001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the User clicks on the Element with Cypress ID "sort-icon-agreement_type_name"
     Then the Element with Cypress ID "sort-icon-agreement_type_name" should NOT have a class "mm-table-header-cell--icon-focused"
     Then the Element with Cypress ID "row-0 subscription-name-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a2" should have the text as "Service provider 2"

   Scenario: Pagination visible
    Given the User "MMAdmin001" is Signed In
    And the IAM Users request has been intercepted to return the Users "MMAdmin001"
    And the IAM Organization request has been intercepted to return the Organization "001" for SP "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "012,013,014,015,016,017,018,019,020,021,022,023,024" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User navigates to "/sc/subscriptions"
    Then the Element with Cypress ID "subscriptions-table" should exist
    And the Element with Cypress ID "pagination" should exist

   Scenario: Successfully redirect to Subscriptions detailed view with correct info
    Given the User "MMAdmin001" is Signed In
    And the feature flag "legal_documents" is enabled 
    And the IAM Users request has been intercepted to return the Users "MMAdmin001"
    And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User navigates to "/sc/subscriptions"
    Then the User clicks on the Element with Cypress ID "subscription-name-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    Then the User should be redirected to '/sc/subscriptions/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1'
    When the User clicks on the Element with Cypress ID "back-link"
    Then the User should be redirected to "/sc/subscriptions"
    Then the User clicks on the Element with Cypress ID "actions-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    And the Policies Service Consumers Agreements request has been intercepted to return the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Organization Users "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Organization Groups "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Organization Units "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Policies "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Billing and Invoicing request has been intercepted to return the billing details for the Agreement "001" of Service Consumer "001"
    Then the User clicks on the Element with Cypress ID "actions-dropdown-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1-item-view-subscription"
    Then the User should be redirected to '/sc/subscriptions/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1'
    When the User clicks on the Element with Cypress ID "license-details-header-dropdown button"
    Then the Element with Cypress ID "license-details-header-dropdown-item-update-billing-contact" should have the text as "Update Billing Contact"
    And the Element with Cypress ID "payments-expandable" should exist
    And the Element with Cypress ID "invoices-expandable" should exist
    And the Element with Cypress ID "legal-docs-expandable" should exist

   Scenario: Payments, Invoices and Legal Docs should be populated
     Given the User "MMAdmin001" is Signed In
     And the IAM User @me request has been intercepted to return the User "001"
     And the IAM User request has been intercepted to return the User "001"
     And the IAM Organization units request has been intercepted to return the units of Organization "001"
     And the feature flag "billing_and_invoicing" is enabled
     And the Policies Service Consumers Agreements request has been intercepted to return the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
     And the Billing and Invoicing request has been intercepted to return the billing details for the Agreement "001" of Service Consumer "001"
     When the User navigates to "/sc/subscriptions/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
     When the User clicks on the Element with Cypress ID "payments-expandable"
     Then the Element with Cypress ID "row-0 payment_method" should have the text as "STRIPE"
     And the Contracting request has been intercepted to return the legal document type "001" for the Agreement Type "006" of Service Consumer "001"
     And the User clicks on the Element with Cypress ID "legal-docs-expandable"
     And the intercepted requests have resolved
     Then the Element with Cypress ID "row-0 name" should have the text as "string"
     Then the billing request has been intercepted to return the invoice "001" for the Service Consumer "001" and agreement "86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
     And the User clicks on the Element with Cypress ID "invoices-expandable"
     And the Element with Cypress ID "row-0 invoice_id" contains the text as "Invoice001"
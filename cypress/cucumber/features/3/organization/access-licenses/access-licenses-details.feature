Feature: Service consumer - Access License Details

  Scenario: Access Licenses details has correct info
    Given the User "MMAdmin001" is Signed In
    And the IAM User @me request has been intercepted to return the User "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM User request has been intercepted to return the User "001"
    And the Policies Service Consumers Agreements request has been intercepted to return the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Organization Users "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Organization Groups "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Organization Units "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Policies "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Billing and Invoicing request has been intercepted to return the billing details for the Agreement "001" of Service Consumer "001"
    Then the IAM Organization request has been intercepted to return the SP "001" from Organization "001"
    And the IAM Organization Users request has been intercepted to return Users "001" from Organization "001"
    When the User navigates to "/sc/access-licenses/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    Then the Element with Cypress ID "header-title" contains the text as "Service provider 1 from Org 001 "
    And the Element with Cypress ID "header-subtitle" contains the text as "All your license activity"
    And the Element with Cypress ID "header-title badge" contains the text as "Active"
    And the Element with Cypress ID "effective-from" contains the text as "10 Apr 2024"
    And the Element with Cypress ID "pricing-model" should NOT exist
    And the Element with Cypress ID "price" should NOT exist
    And the Element with Cypress ID "billing-period" should NOT exist
    And the Element with Cypress ID "next-billing-date" should NOT exist

  Scenario: Access Licenses details has Cancelled badge in title
    Given the User "MMAdmin001" is Signed In
    And the IAM User @me request has been intercepted to return the User "001"
    And the IAM User request has been intercepted to return the User "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the Policies Service Consumers Agreements request has been intercepted to return the License "001-cancelled" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Organization Users "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Organization Groups "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Organization Units "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Policies "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Billing and Invoicing request has been intercepted to return the billing details for the Agreement "001" of Service Consumer "001"
    And the IAM Organization Users request has been intercepted to return Users "001" from Organization "001"
    When the User navigates to "/sc/access-licenses/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    Then the Element with Cypress ID "header-title badge" contains the text as "Cancelled"

  Scenario: Legal docs table should be populated and Payments, Invoices should not exist
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
    And the IAM Organization Users request has been intercepted to return Users "001" from Organization "001"
    Then the User clicks on the Element with Cypress ID "license-name-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    Then the User should be redirected to '/sc/access-licenses/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1'
    And the Contracting request has been intercepted to return the legal document type "001" for the Agreement Type "006" of Service Consumer "001"
    When the User clicks on the Element with Cypress ID "legal-docs-expandable"
    Then the Element with Cypress ID "row-0 name" should have the text as "string"
    And the Element with Cypress ID "payments-expandable" should NOT exist
    And the Element with Cypress ID "invoices-expandable" should NOT exist

  Scenario: Details Page has new field Contact with no info
    Given the User "MMAdmin001" is Signed In
    And the IAM User @me request has been intercepted to return the User "001"
    And the IAM User request has been intercepted to return the User "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the Policies Service Consumers Agreements request has been intercepted to return the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Organization Users "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Organization Groups "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Organization Units "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Policies "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    Then the IAM Organization request has been intercepted to return the SP "001" from Organization "001"
    And the Billing and Invoicing request has been intercepted to return the billing details for the Agreement "001" of Service Consumer "001"
    And the IAM Organization Users request has been intercepted to return Users "001" from Organization "001"
    When the User navigates to "/sc/access-licenses/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    Then the Element with Cypress ID "contact" contains the text as "-"
    
  Scenario: Details Page has new field Contact with info
    Given the User "MMAdmin001" is Signed In
    And the IAM User @me request has been intercepted to return the User "001"
    And the IAM User request has been intercepted to return the User "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
    And the Policies Service Consumers Agreements request has been intercepted to return the License "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Organization Users "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Organization Groups "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Organization Units "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Policies "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    Then the IAM Organization request has been intercepted to return the SP "001" from Organization "001"
    And the Billing and Invoicing request has been intercepted to return the billing details for the Agreement "002" of Service Consumer "001"
    When the User navigates to "/sc/access-licenses/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a2"
    Then the Element with Cypress ID "contact" contains the text as "User 001"

  Scenario: Actions button to Update Contact info should only appear if license is active or pending
    Given the User "MMAdmin001" is Signed In
    And the IAM User @me request has been intercepted to return the User "001"
    And the IAM User request has been intercepted to return the User "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
    And the Policies Service Consumers Agreements request has been intercepted to return the License "002" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Organization Users "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Organization Groups "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Organization Units "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Policies "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    Then the IAM Organization request has been intercepted to return the SP "001" from Organization "001"
    And the Billing and Invoicing request has been intercepted to return the billing details for the Agreement "002" of Service Consumer "001"
    When the User navigates to "/sc/access-licenses/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a2"
    Then the Element with Cypress ID "license-details-header-dropdown" should exist
    Then the User clicks on the Element with Cypress ID "license-details-header-dropdown"
    And the Element with Cypress ID "license-details-header-dropdown-item-update-license-contact" contains the text as "Update License Contact"
    And the Policies Service Consumers Agreements request has been intercepted to return the License "001-cancelled" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    When the User navigates to "/sc/access-licenses/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    Then the Element with Cypress ID "license-details-header-dropdown" should NOT exist

  Scenario: Should be possible to see add users modal
    Given the User "MMAdmin001" is Signed In
    And the IAM User @me request has been intercepted to return the User "001"
    And the IAM User request has been intercepted to return the User "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
    And the Policies Service Consumers Agreements request has been intercepted to return the License "002" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Organization Users "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Organization Groups "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Organization Units "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Policies "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    Then the IAM Organization request has been intercepted to return the SP "001" from Organization "001"
    And the Billing and Invoicing request has been intercepted to return the billing details for the Agreement "002" of Service Consumer "001"
    When the User navigates to "/sc/access-licenses/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a2"
    When the User clicks on the Element with Cypress ID "license-details-header-dropdown button"
    And the User clicks on the Element with Cypress ID "license-details-header-dropdown-item-update-license-contact"
    Then the Element with Cypress ID "dialog-billing-contact" should exist
    And the Element with Cypress ID "button-add-user" should be disabled
    And the User clicks on the Element with Cypress ID "button-close-dialog"
    Then the Element with Cypress ID "dialog-billing-contact" should NOT exist

  Scenario: Should be possible to add users and update contact info
    Given the User "MMAdmin001" is Signed In
    And the IAM User @me request has been intercepted to return the User "001"
    And the IAM User request has been intercepted to return the User "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization Users request has been intercepted to return Users "001,002" from Organization "001"
    And the Policies Service Consumers Agreements request has been intercepted to return the License "003" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Organization Users "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Organization Groups "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Organization Units "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return Policies "001" for the License "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    Then the IAM Organization request has been intercepted to return the SP "001" from Organization "001"
    And the Billing and Invoicing request has been intercepted to return the billing details for the Agreement "002" of Service Consumer "001"
    When the User navigates to "/sc/access-licenses/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a2"
    When the User clicks on the Element with Cypress ID "license-details-header-dropdown button"
    And the User clicks on the Element with Cypress ID "license-details-header-dropdown-item-update-license-contact"
    And the User clicks on the Element with Cypress ID "org-users"
    And the User selects option with Cypress ID "mm-select-option-ded35af8-c60c-4f98-b35b-64db59deb4a7" in the Select with Cypress ID "org-users"
    And the Element with Cypress ID "org-users" contains the text as "User 002"
    And the User clicks on the Element with Cypress ID "org-users"
    And the Service Consumer "4a6f01d0-f3c6-4923-ad98-112d6d97355b" Agreement request has been intercepted to update contact "001" in Agreement "002"
    And the IAM User request has been intercepted to return the User "002"
    And the User clicks on the Element with Cypress ID "button-add-user"
    Then the Element with Cypress ID "contact" contains the text as "User 002"

  Scenario: Button activate license to go to checkout page should not exist if license is access license
    Given the User "MMAdmin001" is Signed In
    And the IAM User @me request has been intercepted to return the User "001"
    And the IAM User request has been intercepted to return the User "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the feature flag "billing_and_invoicing" is enabled
    And the Billing and Invoicing request has been intercepted to return the billing details for the Agreement "003" of Service Consumer "001"
    And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
    And the Policies Service Consumers Agreements request has been intercepted to return the License "002" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the contracting request has been intercepted to return the documents "001" for agreement "86678c73-b72a-4c8e-9dca-0bf5d1a1c6a2" for Service Consumer "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    When the User navigates to "/sc/access-licenses/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a2"
    Then the Element with Cypress ID "button-activate-license" should NOT exist
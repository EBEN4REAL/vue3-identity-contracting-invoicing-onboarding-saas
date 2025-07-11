Feature: Access Management - Organization update

  Scenario: Button Edit Details should exist
    Given the User "005" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    When the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    Then the Element with Cypress ID "button-edit-details" should exist

  Scenario: Button edit should open edit mode
    Given the User "005" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    When the User clicks on the Element with Cypress ID "button-edit-details"
    Then the Element with Cypress ID "organization-details-update" should exist

  Scenario: Button Dismiss should exist in edit mode
    Given the User "005" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    When the User clicks on the Element with Cypress ID "button-edit-details"
    Then the Element with Cypress ID "organization-details-update button-dismiss" should exist

  Scenario: Button Save changes should exist in edit mode
    Given the User "005" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    When the User clicks on the Element with Cypress ID "button-edit-details"
    Then the Element with Cypress ID "organization-details-update button-save-changes" should exist

  Scenario: Button Dismiss should exit edit mode
    Given the User "005" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User clicks on the Element with Cypress ID "button-edit-details"
    When the User clicks on the Element with Cypress ID "organization-details-update button-dismiss"
    Then the Element with Cypress ID "organization-details-update" should NOT exist

  Scenario: Changes in Organization Name input should not be saved after User presses button Dismiss and re-opens Edit mode
    Given the User "005" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User clicks on the Element with Cypress ID "button-edit-details"
    And the User types "New Organization Name" in the Element with Cypress ID "organization-details-update input-organization-name"
    And the User clicks on the Element with Cypress ID "organization-details-update button-dismiss"
    When the User clicks on the Element with Cypress ID "button-edit-details"
    Then the Input with Cypress ID "organization-details-update input-organization-name" should have value as "Org 001"

  Scenario: Changes in Organization Industry select should not be saved after User presses button Dismiss and re-opens Edit mode
    Given the User "005" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User clicks on the Element with Cypress ID "button-edit-details"
    And the User clicks on the Element with Cypress ID "organization-details-update select-organization-industry"
    And the User selects option with Cypress ID "mm-select-option-SAAS" in the Select with Cypress ID "select-organization-industry"
    And the User clicks on the Element with Cypress ID "organization-details-update button-dismiss"
    When the User clicks on the Element with Cypress ID "button-edit-details"
    Then the Select with Cypress ID "select-organization-industry" should have the value as "SAAS"

  Scenario: Changes in Organization Number of Employees Range select should not be saved after User presses button Dismiss and re-opens Edit mode
    Given the User "005" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User clicks on the Element with Cypress ID "button-edit-details"
    And the User selects option with Cypress ID "mm-select-option-201-999" in the Select with Cypress ID "select-organization-range-of-employees"
    And the Element with Cypress ID "organization-details-update select-organization-range-of-employees" contains the text as "201-999"
    And the User clicks on the Element with Cypress ID "organization-details-update button-dismiss"
    When the User clicks on the Element with Cypress ID "button-edit-details"
    Then the Select with Cypress ID "select-organization-range-of-employees" should have the value as "1-10"

  Scenario: Successfully change Organization name
    Given the User "005" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User clicks on the Element with Cypress ID "button-edit-details"
    And the User types "New Organization Name" in the Element with Cypress ID "organization-details-update input-organization-name"
    And the IAM Update Organization "001" request has been intercepted to return updated Organization "001-updated-name"
    And the IAM Organization request has been intercepted to return the Organization "001-updated-name"
    When the User clicks on the Element with Cypress ID "button-save-changes"
    Then the Element with Cypress ID "organization-details-read org-name organization-detail-item-text" should have the text as "New organization name"

  Scenario: Successfully change Organization Industry
    Given the User "005" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User clicks on the Element with Cypress ID "button-edit-details"
    And the User selects option with Cypress ID "mm-select-option-HEALTHCARE" in the Select with Cypress ID "select-organization-industry"
    And the IAM Update Organization "001" request has been intercepted to return updated Organization "001-updated-industry"
    And the IAM Organization request has been intercepted to return the Organization "001-updated-industry"
    When the User clicks on the Element with Cypress ID "button-save-changes"
    Then the Element with Cypress ID "organization-details-read industry organization-detail-item-text" should have the text as "Healthcare"

  Scenario: Successfully change Organization Number of Employees Range
    Given the User "005" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User clicks on the Element with Cypress ID "button-edit-details"
    And the Element with Cypress ID "organization-details-update select-organization-range-of-employees" contains the text as "201-999"
    And the IAM Update Organization "001" request has been intercepted to return updated Organization "001-updated-number_of_employees_range"
    And the IAM Organization request has been intercepted to return the Organization "001-updated-number_of_employees_range"
    When the User clicks on the Element with Cypress ID "button-save-changes"
    Then the Element with Cypress ID "organization-details-read number-of-employees organization-detail-item-text" should have the text as "201-999"

  Scenario: Show error for empty Organization name field
    Given the User "005" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User clicks on the Element with Cypress ID "button-edit-details"
    And the User clears the Input inside Element with Cypress ID "input-organization-name"
    When the User clicks outside
    Then the Element with Cypress ID "input-organization-name" should have a Form Error for validator "required" with text "Organization name is required"

  Scenario: Show error for too long Organization name field
    Given the User "005" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User clicks on the Element with Cypress ID "button-edit-details"
    And the User types "qwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiop" in the Element with Cypress ID "organization-details-update input-organization-name"
    When the User clicks outside
    Then the Element with Cypress ID "input-organization-name" should have a Form Error for validator "maxLength" with text "Organization name is too long"

   Scenario: Add billing address information to organization
    Given the User "005" is Signed In
    And the feature flag "billing_and_invoicing" is enabled
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User clicks on the Element with Cypress ID "button-edit-details"
    And the User types "Netherlands" in the Element with Cypress ID "input-country"
    And the User types "Simsekstraat 2z" in the Element with Cypress ID "input-address-line-1"
    And the User types "de Gruijlstraat 9" in the Element with Cypress ID "input-address-line-2"
    And the User types "1674PG" in the Element with Cypress ID "input-postal-code"
    And the User types "Bosch en Duin" in the Element with Cypress ID "input-city-town"
    Then the IAM Update Organization "001" request has been intercepted to return updated Organization "001"
    And the Billing and Invoicing request has been intercepted to add and return the billing address "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    Then the Billing and Invoicing request has been intercepted to return the billing address "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    When the User clicks on the Element with Cypress ID "button-save-changes"
    Then the Element with Cypress ID "billing-address organization-detail-item-text" should have the text as "Simsekstraat 2z, de Gruijlstraat 9, Netherlands, Bosch en Duin, 1674PG"

   Scenario: Update billing address information from organization
    Given the User "005" is Signed In
    And the feature flag "billing_and_invoicing" is enabled
    And the IAM Organization request has been intercepted to return the Organization "001"
    Then the Billing and Invoicing request has been intercepted to return the billing address "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    Then the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    Then the Billing and Invoicing request has been intercepted to return the billing address "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    Then the Element with Cypress ID "billing-address organization-detail-item-text" should have the text as "Simsekstraat 2z, de Gruijlstraat 9, Netherlands, Bosch en Duin, 1674PG"
    And the User clicks on the Element with Cypress ID "button-edit-details"
    And the User types "Belgium" in the Element with Cypress ID "input-country"
    And the User types "Simsekstraat 2z" in the Element with Cypress ID "input-address-line-1"
    And the User types "de Gruijlstraat 9" in the Element with Cypress ID "input-address-line-2"
    And the User types "1674PG" in the Element with Cypress ID "input-postal-code"
    And the User types "Bosch en Duin" in the Element with Cypress ID "input-city-town"
    Then the IAM Update Organization "001" request has been intercepted to return updated Organization "001"
    And the Billing and Invoicing request has been intercepted to update the billing address "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    Then the Billing and Invoicing request has been intercepted to return the billing address "Updated001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    When the User clicks on the Element with Cypress ID "button-save-changes"
    Then the Element with Cypress ID "billing-address organization-detail-item-text" should have the text as "Simsekstraat 2z, de Gruijlstraat 9, Belgium, Bosch en Duin, 1674PG"

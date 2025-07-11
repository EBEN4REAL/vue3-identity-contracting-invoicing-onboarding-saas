Feature: Access Management - Users - Dropdown Menu - Add to Unit

  Scenario: Add to unit dialog should exist
    Given the User "005" is Signed In
    And the IAM Users request has been intercepted to return the Users "005"
    And the IAM Organization Groups request has been intercepted to return Groups "001,002,003" from Organization "001"
    And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
    And the User navigates to "/sc/users"
    And the User clicks on the Element with Cypress ID "dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b button-dropdown-activator"
    When the User clicks on the Element with Cypress ID "dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b-item-add-to-organization-unit"
    Then the Element with Cypress ID "dialog-add-user-to-unit" should exist

  Scenario: Correct Organization unit should be preselected after opening dialog
    Given the User "005" is Signed In
    And the IAM Users request has been intercepted to return the Users "005"
    And the IAM Organization units request has been intercepted to return Units for Organization "001"
    And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
    And the User navigates to "/sc/users"
    And the User clicks on the Element with Cypress ID "dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b button-dropdown-activator"
    When the User clicks on the Element with Cypress ID "dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b-item-add-to-organization-unit"
    Then the Element with Cypress ID "mm-select-value-01234567-89ab-cdef-0123-456789abcdef" should have the text as " Unit 1"

  Scenario: User should add Organization User to unit
    Given the User "005" is Signed In
    And the IAM Users request has been intercepted to return the Users "005"
    And the IAM Organization units request has been intercepted to return Units for Organization "001"
    And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
    And the User navigates to "/sc/users"
    And the User clicks on the Element with Cypress ID "dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b button-dropdown-activator"
    And the User clicks on the Element with Cypress ID "dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b-item-add-to-organization-unit"
    And the User selects option with Cypress ID "mm-select-option-11234567-89ab-cdef-0123-456789abcdef" in the Select with Cypress ID "select-organization-unit"
    And the IAM Organization unit request has been intercepted to add user to unit "11234567-89ab-cdef-0123-456789abcdef" within organization "001"
    And the IAM Organization Users request has been intercepted to return Users "001-with-unit-002,002,003" from Organization "001"
    When the User clicks on the Element with Cypress ID "button-submit-add-to-organization-unit"
    Then the Element with Cypress ID "organization-users-table row-0 unit" should have the text as "Unit 2"

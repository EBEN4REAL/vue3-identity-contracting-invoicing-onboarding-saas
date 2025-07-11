Feature: Access Management - Users - Dropdown Menu - Add to Group

  Scenario: Add to group dialog should exist
    Given the User "005" is Signed In
    And the IAM Users request has been intercepted to return the Users "005"
    And the IAM Organization Groups request has been intercepted to return Groups "001,002,003" from Organization "001"
    And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
    And the User navigates to "/sc/users"
    And the User clicks on the Element with Cypress ID "dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b button-dropdown-activator"
    When the User clicks on the Element with Cypress ID "dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b-item-add-to-group"
    Then the Element with Cypress ID "dialog-add-user-to-group" should exist

  Scenario: Should be able to add user to group and disable groups that the user is alredy mapped to in the groups dropdown successfully
    Given the User "005" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Users request has been intercepted to return the Users "005"
    And the IAM Organization Groups request has been intercepted to return Groups "001,002,004" from Organization "001"
    And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
    And the IAM Organization Groups request has been intercepted to return Groups "001,002,004" for User "001" from Organization "001"
    And the IAM Organization Groups request has been intercepted to return Groups "002,004" for User "002" from Organization "001"
    And the IAM Organization Groups request has been intercepted to return Groups "004" for User "003" from Organization "001"
    And the IAM Organization units request has been intercepted to return Units for Organization "001"
    And the User navigates to "/sc/users"
    When the User clicks on the Element with Cypress ID "dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b button-dropdown-activator"
    And the IAM Organization Groups request has been intercepted to return Groups "001,002,004" from Organization "001"
    And the IAM Organization Groups request has been intercepted to return Groups "002,004" for User "001" from Organization "001"
    And the User clicks on the Element with Cypress ID "dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b-item-add-to-group"
    And the intercepted requests have resolved
    And the User clicks on the Element with Cypress ID "select-multiple-add-user-to-group"
    And the Element with Cypress ID "mm-select-option-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a2" should have a class "mm-select-option--disabled"
    And the Element with Cypress ID "mm-select-option-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a2" should have a class "mm-select-option--disabled"
    And the User selects option with Cypress ID "mm-select-option-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1" in the Select with Cypress ID "select-multiple-add-user-to-group"
    And the IAM Organization groups request has been intercepted to add User "001" to Groups "001" in Organization "001"
    And the IAM Organization Groups request has been intercepted to return Groups "001,002,004" for User "001" from Organization "001"
    And the Element with Cypress ID "dialog-add-user-to-group" should be visible
    And the Element with Cypress ID "button-remove-user" should NOT exist
    And the User force clicks on the Element with Cypress ID "dialog-add-user-to-group button-add-user-to-group"
    Then the Element with Cypress ID "organization-users-table row-0" should exist
    And the Element with Cypress ID "dialog-add-user-to-group" should NOT exist

   


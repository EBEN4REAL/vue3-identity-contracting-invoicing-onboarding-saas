Feature: Access Management - Users - Dropdown Menu - Remove User

  Scenario: Remove User Dialog should exist
    Given the User "005" is Signed In
    And the IAM Users request has been intercepted to return the Users "005"
    And the IAM Organization Groups request has been intercepted to return Groups "001,002,003" from Organization "001"
    And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
    And the User navigates to "/sc/users"
    And the User clicks on the Element with Cypress ID "dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b button-dropdown-activator"
    When the User clicks on the Element with Cypress ID "dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b-item-remove-user"
    Then the Element with Cypress ID "dialog-confirm-remove-user-from-organization" should exist

  Scenario: User should be removed from table
    Given the User "005" is Signed In
    And the IAM Users request has been intercepted to return the Users "005"
    And the IAM Organization Groups request has been intercepted to return Groups "001,002,003" from Organization "001"
    And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
    And the User navigates to "/sc/users"
    And the User clicks on the Element with Cypress ID "dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b button-dropdown-activator"
    And the User clicks on the Element with Cypress ID "dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b-item-remove-user"
    And the IAM Organization delete Organization User with ID "001" from Organization "001" request has been intercepted
    And the IAM Organization Users request has been intercepted to return Users "002,003" from Organization "001"
    When the User clicks on the Element with Cypress ID "dialog-confirm-remove-user-from-organization button-submit"
    Then the Element with Cypress ID "organization-users-table row-0 name" should have the text as "User 002"

Feature: Access Management - Users - Dropdown Menu - Reset Password

  Scenario: Should be able to reset organization user password successfully
    Given the User "005" is Signed In
    And the IAM Users request has been intercepted to return the Users "005"
    And the IAM Organization Groups request has been intercepted to return Groups "001,002,003" from Organization "001"
    And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
    And the User navigates to "/sc/users"
    When the User clicks on the Element with Cypress ID "dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b button-dropdown-activator"
    And the User clicks on the Element with Cypress ID "dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b-item-reset-password"
    And the Element with Cypress ID "dialog-confirm-reset-password" should be visible
    And the IAM Organization reset Organization User password with ID "001" from Organization "001" request has been intercepted
    And the User clicks on the Element with Cypress ID "button-reset-password"
    And Organization User Password has been reset successfuly
    Then the Element with Cypress ID "dialog-confirm-reset-password" should NOT exist
  
   Scenario: Organization Admin Should be able to reset organization user TOTP successfully
    Given the User "003" is Signed In
    And the IAM Users request has been intercepted to return the Users "005"
    And the IAM Organization Groups request has been intercepted to return Groups "001,002,003" from Organization "001"
    And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
    And the User navigates to "/sc/users"
    When the User clicks on the Element with Cypress ID "dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b button-dropdown-activator"
    And the User clicks on the Element with Cypress ID "dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b-item-reset-totp"
    Then the Element with Cypress ID "dialog-confirm-reset-totp" should be visible
    And the IAM Organization reset Organization User TOTP with ID "001" from Organization "001" request has been intercepted
    And the User clicks on the Element with Cypress ID "button-reset-totp"
    And the Organization User TOTP has been reset successfuly
    And the Element with Cypress ID "dialog-confirm-reset-totp" should NOT exist

Feature: Access Management - Users - Dropdown Menu - View Details

  Scenario: View Details of User
    Given the User "005" is Signed In
    And the IAM Users request has been intercepted to return the Users "005"
    And the IAM Organization Groups request has been intercepted to return Groups "001,002,003" from Organization "001"
    And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
    And the User navigates to "/sc/users"
    And the User clicks on the Element with Cypress ID "dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b button-dropdown-activator"
    When the User clicks on the Element with Cypress ID "dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b-item-view-details"
    Then the User should be redirected to "/sc/users/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
  
  Scenario: Test enum cases
    Given the User "005" is Signed In
    And the IAM Users request has been intercepted to return the Users "005"
    And the IAM Organization Groups request has been intercepted to return Groups "001,002,003" from Organization "001"
    And the IAM Organization Users request has been intercepted to return Users "001,001-disabled,001-without-organization,002,003,004,005" from Organization "001"
    And the User navigates to "/sc/users"
    Then the Element with Cypress ID "dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b button-dropdown-activator" should exist

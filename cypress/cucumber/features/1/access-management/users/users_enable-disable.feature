Feature: Access Management - Users - Enable/Disable user

  Scenario: Show disable for not current user
    Given the User "003" is Signed In
    And the IAM User @me request has been intercepted to return the User "003"
    And the IAM Organization Groups request has been intercepted to return Groups "001" from Organization "001"
    And the IAM Organization Users request has been intercepted to return Users "001" from Organization "001"
    When the User navigates to "/sc/users"
    Then the Element with Cypress ID "dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b-item-disable-user" should exist

  Scenario: Hide disable for current user
    Given the User "003" is Signed In
    And the IAM User @me request has been intercepted to return the User "003"
    And the IAM Organization Groups request has been intercepted to return Groups "003" from Organization "001"
    And the IAM Organization Users request has been intercepted to return Users "003" from Organization "001"
    When the User navigates to "/sc/users"
    Then the Element with Cypress ID "dropdown-ded35af8-c60c-4f98-b35b-64db59deb4a7-item-disable-user" should NOT exist

  Scenario: Show confirm modal after clicking disable
    Given the User "003" is Signed In
    And the IAM User @me request has been intercepted to return the User "003"
    And the IAM Organization Groups request has been intercepted to return Groups "001" from Organization "001"
    And the IAM Organization Users request has been intercepted to return Users "001" from Organization "001"
    And the User navigates to "/sc/users"
    And the User clicks on the Element with Cypress ID "dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    When the User clicks on the Element with Cypress ID "dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b-item-disable-user"
    Then the Element with Cypress ID "dialog-confirm-disable-user" should be visible

  Scenario: Show enable for disabled user
    Given the User "003" is Signed In
    And the IAM User @me request has been intercepted to return the User "003"
    And the IAM Organization Groups request has been intercepted to return Groups "001" from Organization "001"
    And the IAM Organization Users request has been intercepted to return Users "001-disabled" from Organization "001"
    When the User navigates to "/sc/users"
    Then the Element with Cypress ID "dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b-item-enable-user" should exist

  Scenario: Show confirm modal after clicking disable
    Given the User "003" is Signed In
    And the IAM User @me request has been intercepted to return the User "003"
    And the IAM Organization Groups request has been intercepted to return Groups "001" from Organization "001"
    And the IAM Organization Users request has been intercepted to return Users "001-disabled" from Organization "001"
    And the User navigates to "/sc/users"
    And the User clicks on the Element with Cypress ID "dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    When the User clicks on the Element with Cypress ID "dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b-item-enable-user"
    Then the Element with Cypress ID "dialog-confirm-enable-user" should be visible

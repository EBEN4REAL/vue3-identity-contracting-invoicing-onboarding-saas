Feature: Access Management - User - Groups - Add To Group

 Scenario: Add User to Group 

    Given the User "005" is Signed In
    And the IAM Organizations request has been intercepted to return the Organizations "001"
    And the IAM Organization User request has been intercepted to return the User "002" from Organization "001"
    And the IAM Organization User request has been intercepted to return Groups "003" for the User "002" from Organization "001"
    And the IAM User request has been intercepted to return the User "002"
    And the IAM User @me request has been intercepted to return the User "005"
    And the User navigates to "/sc/users/ded35af8-c60c-4f98-b35b-64db59deb4a7"
    When the User clicks on the Element with Cypress ID "tabs tab-item-groups"
    And the IAM Organization Groups request has been intercepted to return Groups "001,002,004" from Organization "001"
    Then the Element with Cypress ID "user-groups-table row-0 name" contains the text as "Group 003"
    And the Element with Cypress ID "actions-button-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1" should exist
    And the Element with Cypress ID "add-to-group-button" should exist
    And the Element with Cypress ID "page-subtitle" contains the text as "All groups User 002 is added to."
    When the User clicks on the Element with Cypress ID "add-to-group-button"
    Then the User selects option with Cypress ID "mm-select-option-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a4" in the Select with Cypress ID "select-multiple-add-user-to-group"
    Then the IAM Organization add User request has been intercepted to add Users "002" from Organization "001" to Group "004"
    And the IAM Organization User request has been intercepted to return Groups "003,004" for the User "002" from Organization "001"
    Then the User clicks on the Element with Cypress ID "button-add-user-to-group"
    Then the Element with Cypress ID "user-groups-table row-1 name" contains the text as "Group 004"

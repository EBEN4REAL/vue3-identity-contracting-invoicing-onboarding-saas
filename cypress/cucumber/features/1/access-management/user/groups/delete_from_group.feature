Feature: Access Management - User - Groups - Delete from Group

  Scenario: Delete User from Group from actions dropdown

    Given the User "005" is Signed In
    And the IAM Organizations request has been intercepted to return the Organizations "001"
    And the IAM Organization User request has been intercepted to return the User "002" from Organization "001"
    And the IAM Organization User request has been intercepted to return Groups "003,004" for the User "002" from Organization "001"
    And the IAM User request has been intercepted to return the User "002"
    And the IAM User @me request has been intercepted to return the User "005"
    And the User navigates to "/sc/users/ded35af8-c60c-4f98-b35b-64db59deb4a7"
    When the User clicks on the Element with Cypress ID "tabs tab-item-groups"
    And the IAM Organization Groups request has been intercepted to return Groups "003,004" from Organization "001"
    Then the Element with Cypress ID "user-groups-table row-0 name" contains the text as "Group 003"
    Then the Element with Cypress ID "user-groups-table row-0 actions-button-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1" should exist
    And the User clicks on the Element with Cypress ID "user-groups-table row-0 actions-button-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    Then the Element with Cypress ID "dropdown-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1-item-remove-user-from-group" should exist
    Then the User clicks on the Element with Cypress ID "dropdown-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1-item-remove-user-from-group"
    Then the IAM Organization ID "001" with Group ID "003" with User ID "ded35af8-c60c-4f98-b35b-64db59deb4a7" delete User from organization request has been intercepted to delete User
    Then the User clicks on the Element with Cypress ID "button-confirm-delete-user"
    And the IAM Organization User request has been intercepted to return Groups "004" for the User "002" from Organization "001"

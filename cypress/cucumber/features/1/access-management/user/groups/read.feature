Feature: Access Management - User - Groups - Read

  Scenario: Groups table should exist

    Given the User "005" is Signed In
    And the IAM User @me request has been intercepted to return the User "005"
    And the IAM Organization User request has been intercepted to return the User "002" from Organization "001"
    And the IAM Organization User request has been intercepted to return Groups "001" for the User "002" from Organization "001"
    And the User navigates to "/sc/users/ded35af8-c60c-4f98-b35b-64db59deb4a7"
    And the Service Consumers Policies request has been intercepted to return the PolicyType "004" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with pagination
    When the User clicks on the Element with Cypress ID "tabs tab-item-groups"
    Then the Element with Cypress ID "user-groups-table" should exist

  Scenario: Groups table should contain proper Group name

    Given the User "005" is Signed In
    And the IAM User @me request has been intercepted to return the User "005"
    And the IAM Organizations request has been intercepted to return the Organizations "001"
    And the IAM Organization User request has been intercepted to return the User "002" from Organization "001"
    And the IAM Organization User request has been intercepted to return Groups "003" for the User "002" from Organization "001"
    And the User navigates to "/sc/users/ded35af8-c60c-4f98-b35b-64db59deb4a7"
    When the User clicks on the Element with Cypress ID "tabs tab-item-groups"
    Then the Element with Cypress ID "user-groups-table row-0 name" contains the text as "Group 003"

  Scenario: Groups table should contain proper Group description

    Given the User "005" is Signed In
    And the IAM User @me request has been intercepted to return the User "005"
    And the IAM Organizations request has been intercepted to return the Organizations "001"
    And the IAM Organization User request has been intercepted to return the User "002" from Organization "001"
    And the IAM Organization User request has been intercepted to return Groups "003" for the User "002" from Organization "001"
    And the User navigates to "/sc/users/ded35af8-c60c-4f98-b35b-64db59deb4a7"
    When the User clicks on the Element with Cypress ID "tabs tab-item-groups"
    Then the Element with Cypress ID "user-groups-table row-0 description" contains the text as "Group 003 Description"

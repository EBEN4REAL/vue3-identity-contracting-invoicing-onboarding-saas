Feature: Access Management - User - Header

  Scenario: Header title has to contain User full name
    Given the User "005" is Signed In
    And the IAM User @me request has been intercepted to return the User "005"
    And the IAM Organization User request has been intercepted to return the User "002" from Organization "001"
    And the IAM Organization Groups request has been intercepted to return the Groups "001" from Organization "001"
    When the User navigates to "/sc/users/ded35af8-c60c-4f98-b35b-64db59deb4a7"
    Then the Element with Cypress ID "header-title" contains the text as "User 002"

  Scenario: Header subtitle has to contain User email
    Given the User "005" is Signed In
    And the IAM User @me request has been intercepted to return the User "005"
    And the IAM Organization User request has been intercepted to return the User "002" from Organization "001"
    And the IAM Organization Groups request has been intercepted to return the Groups "001" from Organization "001"
    When the User navigates to "/sc/users/ded35af8-c60c-4f98-b35b-64db59deb4a7"
    Then the Element with Cypress ID "header-subtitle" should have the text as "User002@email.com"

  Scenario: Header to contain tabs
    Given the User "005" is Signed In
    And the IAM User @me request has been intercepted to return the User "005"
    And the IAM Organization User request has been intercepted to return the User "002" from Organization "001"
    And the IAM Organization Groups request has been intercepted to return the Groups "001" from Organization "001"
    When the User navigates to "/sc/users/ded35af8-c60c-4f98-b35b-64db59deb4a7"
    Then the Element with Cypress ID "tabs" should exist

  Scenario: Header to contain tab User Details
    Given the User "005" is Signed In
    And the IAM User @me request has been intercepted to return the User "005"
    And the IAM Organization User request has been intercepted to return the User "002" from Organization "001"
    And the IAM Organization Groups request has been intercepted to return the Groups "001" from Organization "001"
    When the User navigates to "/sc/users/ded35af8-c60c-4f98-b35b-64db59deb4a7"
    Then the Element with Cypress ID "tabs tab-item-basic-information" should have the text as "Basic Information"

  Scenario: Header to contain tab Groups
    Given the User "005" is Signed In
    And the IAM User @me request has been intercepted to return the User "005"
    And the IAM Organization User request has been intercepted to return the User "002" from Organization "001"
    And the IAM Organization Groups request has been intercepted to return the Groups "001" from Organization "001"
    When the User navigates to "/sc/users/ded35af8-c60c-4f98-b35b-64db59deb4a7"
    Then the Element with Cypress ID "tabs tab-item-groups" should have the text as "Groups"

  Scenario: Header to contain tab Access
    Given the User "005" is Signed In
    And the IAM User @me request has been intercepted to return the User "005"
    And the IAM Organization User request has been intercepted to return the User "002" from Organization "001"
    And the IAM Organization Groups request has been intercepted to return the Groups "001" from Organization "001"
    When the User navigates to "/sc/users/ded35af8-c60c-4f98-b35b-64db59deb4a7"
    Then the Element with Cypress ID "tabs tab-item-access" should have the text as "Access"

  Scenario: Header tab User Details should be active after click
    Given the User "005" is Signed In
    And the IAM User @me request has been intercepted to return the User "005"
    And the IAM Organization User request has been intercepted to return the User "002" from Organization "001"
    And the IAM Organization Groups request has been intercepted to return the Groups "001" from Organization "001"
    And the User navigates to "/sc/users/ded35af8-c60c-4f98-b35b-64db59deb4a7"
    When the User clicks on the Element with Cypress ID "tabs tab-item-basic-information"
    Then the Element with Cypress ID "tabs tab-item-basic-information" should have a class "mm-tabs-item--active"

  Scenario: Header tab Groups should be active after click
    Given the User "005" is Signed In
    And the IAM User @me request has been intercepted to return the User "005"
    And the IAM Organization User request has been intercepted to return the User "002" from Organization "001"
    And the IAM Organization Groups request has been intercepted to return the Groups "001" from Organization "001"
    And the User navigates to "/sc/users/ded35af8-c60c-4f98-b35b-64db59deb4a7"
    When the User clicks on the Element with Cypress ID "tabs tab-item-groups"
    Then the Element with Cypress ID "tabs tab-item-groups" should have a class "mm-tabs-item--active"

  Scenario: Header tab Access should be active after click
    Given the User "005" is Signed In
    And the IAM User @me request has been intercepted to return the User "005"
    And the IAM Organization User request has been intercepted to return the User "002" from Organization "001"
    And the IAM Organization Groups request has been intercepted to return the Groups "001" from Organization "001"
    And the User navigates to "/sc/users/ded35af8-c60c-4f98-b35b-64db59deb4a7"
    When the User clicks on the Element with Cypress ID "tabs tab-item-access"
    Then the Element with Cypress ID "tabs tab-item-access" should have a class "mm-tabs-item--active"

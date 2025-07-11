Feature: Access Management - User - Policies Page

  Scenario: Policies table should exist with correct data
    Given the User "003" is Signed In
    And the IAM User @me request has been intercepted to return the User "003"
    And the IAM Organization User request has been intercepted to return the User "002" from Organization "001"
    And the IAM Organization User request has been intercepted to return Groups "001" for the User "002" from Organization "001"
    And the Service Consumers Policies request has been intercepted to return the PolicyType "004" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with pagination
    And the IAM Organization request has been intercepted to return the Organization SP "001" for user id "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the IAM GET Service Providers "001" for Organization "001" request has been intercepted
    And the User navigates to "/sc/users/ded35af8-c60c-4f98-b35b-64db59deb4a7"
    And the Service Consumers Policies request has been intercepted to return the PolicyType from Organization with pagination has been completed
    When the User clicks on the Element with Cypress ID "tabs tab-item-access"
    Then the Element with Cypress ID "users-policies-table row-0 name" should have the text as "Policy #1"
    And the Element with Cypress ID "users-policies-table row-0 owner_name" should have the text as "Org 001"

  Scenario: Policies table with no results
    Given the User "003" is Signed In
    And the IAM User @me request has been intercepted to return the User "003"
    And the IAM Organization User request has been intercepted to return the User "002" from Organization "001"
    And the IAM Organization User request has been intercepted to return Groups "001" for the User "002" from Organization "001"
    And the Service Consumers Policies request has been intercepted to return the PolicyType "no-results" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" with pagination
    And the IAM Organization request has been intercepted to return the Organization SP "001" for user id "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the IAM GET Service Providers "001" for Organization "001" request has been intercepted
    And the User navigates to "/sc/users/ded35af8-c60c-4f98-b35b-64db59deb4a7"
    And the Service Consumers Policies request has been intercepted to return the PolicyType from Organization with pagination has been completed
    When the User clicks on the Element with Cypress ID "tabs tab-item-access"
    Then the Element with Cypress ID "empty-state-title" should exist

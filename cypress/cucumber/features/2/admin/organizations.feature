Feature: Admin - Organizations

  Scenario: Unauthorized

    Given no User is Signed In
    And the IAM OAuth Authorize redirects to the Login page
    When the User navigates to "/sc/admin/organizations"
    Then the User should be redirected to "/login"

  Scenario: Forbidden

    Given the User "002" is Signed In
    When the User navigates to "/sc/admin/organizations"
    Then the Element with selector "#organizations-table" should NOT exist
    Then the Element with selector "#title" should have the text as "404"

  Scenario: Success

    Given the User "MMAdmin001" is Signed In
    And the IAM Organizations request has been intercepted to return the Organizations "001"
    When the User navigates to "/sc/admin/organizations"
    Then the Element with Cypress ID "organizations-table" should be visible

  Scenario: Filter organizations
    Given the User "MMAdmin001" is Signed In
    And the IAM Organizations request has been intercepted to return the Organizations "001,002"
    And the User navigates to "/sc/admin/organizations"
    And the IAM Organizations request has been intercepted to return the Organizations "002"
    When the User types "Org 002" in the Element with Cypress ID "filter"
    Then the Element with Cypress ID "row-0" should exist
    And the Element with Cypress ID "name" should have the text as "Org 002"

  Scenario: Sort organizations by name
    Given the User "MMAdmin001" is Signed In
    And the IAM Organizations request has been intercepted to return the Organizations "001,002"
    And the User navigates to "/sc/admin/organizations"
    And the IAM Organizations request has been intercepted to return the Organizations "002,001"
    When the User clicks on the Element with Cypress ID "sort-icon-name"
    Then the Element with Cypress ID "sort-icon-name" should NOT have a class "mm-table-header-cell--icon-focused"
    
  Scenario: Sort organizations by created date
    Given the User "MMAdmin001" is Signed In
    And the IAM Organizations request has been intercepted to return the Organizations "001,002"
    And the User navigates to "/sc/admin/organizations"
    And the IAM Organizations request has been intercepted to return the Organizations "002,001"
    When the User clicks on the Element with Cypress ID "sort-icon-created_date"
    Then the Element with Cypress ID "sort-icon-name" should have a class "mm-table-header-cell--icon-focused"
    

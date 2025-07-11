@ignore
Feature: Organization Groups Users - Show

  Scenario: Show Organization Groups Users with user in group
    Given the User "005" is Signed In
    And the IAM Organization Groups request has been intercepted to return the Groups "003" from Organization "001"
    When the User navigates to "/sc/groups"
    Then the Element with selector "[data-cy='organization-groups-table']" should exist
    And the Element with selector "[data-cy='name']" should exist
    And the Element with selector "[data-cy='description']" should exist
    And the Element with selector "[data-cy='users']" should exist
    And the Element with selector "[data-cy='actions']" should exist
    And the Element with selector "[data-cy='name']" should have the text as "Group 003"
    And the Element with selector "[data-cy='description']" should have the text as "Group 003 Description"
    And the Element with selector "[data-cy='users']" should have the text as "1"

  Scenario: Show Organization Groups Users with empty group
    Given the User "005" is Signed In
    And the IAM Organization Groups request has been intercepted to return the Groups "002" from Organization "001"
    When the User navigates to "/sc/groups"
    Then the Element with selector "[data-cy='organization-groups-table']" should exist
    And the Element with selector "[data-cy='name']" should exist
    And the Element with selector "[data-cy='name']" should have the text as "Group 2"
    And the Element with selector "[data-cy='users']" should exist
    And the Element with selector "[data-cy='users']" contains the text as "0"

  Scenario: Show Organization Groups Users with no groups
    Given the User "004" is Signed In
    And the IAM Organization Groups request has been intercepted to return no Groups from Organization "001"
    When the User navigates to "/sc/groups"
    Then the Element with selector "[data-cy='organization-groups-table']" should exist
    And the Element with Cypress ID "table-empty-state" should exist
    And the Element with Cypress ID "empty-state-title" contains the text as "Create your first group"

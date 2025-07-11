Feature: Suborganizations - List

  Scenario: Show Suborganizations Tab

    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Suborganizations request has been intercepted to return the Suborganizations "002" for Organization "001"
    When the User clicks on the Element with Cypress ID "tab-item-sub-organizations"
    Then the Element with Cypress ID "sub-organizations-table" contains the text as "Org 002"
    And the Element with Cypress ID "sub-organizations-table" contains the text as "SaaS"

  Scenario: Display pagination

    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Suborganizations request has been intercepted to return the Suborganizations "002,002,002,002,002,002,002,002,002,002,002" for Organization "001"
    When the User clicks on the Element with Cypress ID "tab-item-sub-organizations"
    Then the Element with Cypress ID "pagination" should exist

  Scenario: Successfully sort by sub organization name

    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Suborganizations request has been intercepted to return the Suborganizations "002,004" for Organization "001"
    When the User clicks on the Element with Cypress ID "tab-item-sub-organizations"
    Then the Element with Cypress ID "sub-organizations-table" contains the text as "Org 002"
    Then the Element with Cypress ID "sort-icon-name" should have a class "mm-table-header-cell--icon-focused"
    And the Suborganizations request has been intercepted to return the Suborganizations "004,002" for Organization "001"
    When the User clicks on the Element with Cypress ID "sort-icon-name"
    Then the Element with Cypress ID "sort-icon-name" should NOT have a class "mm-table-header-cell--icon-focused"

  Scenario: Test enums

    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Suborganizations request has been intercepted to return the Suborganizations "001,001-updated-number_of_employees_range,001-updated-industry,001-no-users,011-no-parent,011" for Organization "001"
    Then the Element with Cypress ID "sub-organizations-table" should exist

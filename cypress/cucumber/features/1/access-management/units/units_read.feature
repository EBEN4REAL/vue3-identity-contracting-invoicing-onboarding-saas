Feature: Access Management - Units - Read

  Scenario: Organization Units tree item element should exist
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    When the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    Then the Element with Cypress ID "tree-item-id-01234567-89ab-cdef-0123-456789abcdef" should exist

  Scenario: Organization Units tree item element should have correct parent name
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    Then the Element with Cypress ID "parent mm-data-iterator-item-text" contains the text as "Org 001"

  Scenario: Organization Units tree item element should have correct name
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    When the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    Then the Element with Cypress ID "tree-item-id-01234567-89ab-cdef-0123-456789abcdef" contains the text as "Unit 1"

  Scenario: Organization Unit detail page should have correct header title
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    When the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    Then the Element with Cypress ID "header-title" contains the text as "Unit 1"

  Scenario: Organization Unit detail page should have correct header subtitle
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    When the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    Then the Element with Cypress ID "header-subtitle" contains the text as "unit 1 Description"

  Scenario: Test enums
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "enums"
    And the IAM Organization units request has been intercepted to return the units of Organization "enums"
    And the IAM Organization unit request has been intercepted to return the unit "01334567-89ab-cdef-0123-456789abcdff" of Organization "enums"
    When the User navigates to "/sc/units/01334567-89ab-cdef-0123-456789abcdff"
    Then the Element with Cypress ID "header-title" contains the text as "Unit enums"
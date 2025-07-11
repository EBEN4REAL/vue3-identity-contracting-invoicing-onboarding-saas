Feature: Access Management - Units - Create

  Scenario: Button Create Organization Unit exists
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    When the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    Then the Element with Cypress ID "button-create-organization-unit" should exist

  Scenario: Create Organization Unit dialog should open
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    When the User clicks on the Element with Cypress ID "button-create-organization-unit"
    Then the Element with Cypress ID "organization-unit-dialog-create" should exist

  Scenario: Create Organization Unit dialog should close on button Dismiss
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    And the User clicks on the Element with Cypress ID "button-create-organization-unit"
    When the User clicks on the Element with Cypress ID "button-organization-unit-dialog-create-dismiss"
    Then the Element with Cypress ID "organization-unit-dialog-create" should NOT exist

  Scenario: Default parent value should be the same as current Organization Unit
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    And the User clicks on the Element with Cypress ID "button-create-organization-unit"
    Then the Element with Cypress ID "organization-unit-dialog-create mm-select-value-01234567-89ab-cdef-0123-456789abcdef" contains the text as "Unit 1"

  Scenario: Unit should exist in Organization Units Tree after creation
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    And the User clicks on the Element with Cypress ID "button-create-organization-unit"
    And the User types "Unit 1 NEW" in Input inside Element with Cypress ID "organization-unit-dialog-create input-name"
    And the IAM Organization unit request has been intercepted to create unit "41234567-89ab-cdef-0123-456789abcdef" with name "Unit 1 NEW" of Organization "001"
    When the User clicks on the Element with Cypress ID "button-organization-unit-dialog-create-submit"
    Then the Element with Cypress ID "tree-item-id-41234567-89ab-cdef-0123-456789abcdef" should exist

  Scenario: Unit should have correct name in Organization Units Tree after creation
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    And the User clicks on the Element with Cypress ID "button-create-organization-unit"
    And the User types "Unit 1 NEW" in Input inside Element with Cypress ID "organization-unit-dialog-create input-name"
    And the IAM Organization unit request has been intercepted to create unit "41234567-89ab-cdef-0123-456789abcdef" with name "Unit 1 NEW" of Organization "001"
    When the User clicks on the Element with Cypress ID "button-organization-unit-dialog-create-submit"
    Then the Element with Cypress ID "tree-item-id-41234567-89ab-cdef-0123-456789abcdef" contains the text as "Unit 1 NEW"

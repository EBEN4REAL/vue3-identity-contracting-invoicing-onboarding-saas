Feature: Access Management - Units - Delete

  Scenario: Organization Unit dropdown has delete button
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    When the User force clicks on the Element with Cypress ID "organization-unit-dropdown"
    Then the Element with Cypress ID "organization-unit-dropdown-item-delete-organizational-unit" should exist

  Scenario: Delete Organization Unit dialog should NOT exist after User presses button Dismiss inside Delete Organization Unit dialog
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "006-deletable"
    And the IAM Organization units request has been intercepted to return the units of Organization "006-deletable"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "006-deletable"
    And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    And the intercepted requests have resolved
    And the User force clicks on the Element with Cypress ID "organization-unit-dropdown"
    And the User force clicks on the Element with Cypress ID "organization-unit-dropdown-item-delete-organizational-unit"
    And the Element with Cypress ID "organization-unit-dialog-delete" should exist
    When the User force clicks on the Element with Cypress ID "button-delete-organization-unit-dismiss"
    Then the Element with Cypress ID "organization-unit-dialog-delete" should NOT exist

  Scenario: Delete Organization Unit dialog should have correct title
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "006-deletable"
    And the IAM Organization units request has been intercepted to return the units of Organization "006-deletable"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "006-deletable"
    And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    And the intercepted requests have resolved
    And the User force clicks on the Element with Cypress ID "organization-unit-dropdown"
    When the User force clicks on the Element with Cypress ID "organization-unit-dropdown-item-delete-organizational-unit"
    Then the Element with Cypress ID "organization-unit-dialog-delete" contains the text as "Delete Unit 6"

  Scenario: Organization Unit should not exist in Organization Units Tree after deleting
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "006-deletable"
    And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    And the User force clicks on the Element with Cypress ID "organization-unit-dropdown"
    And the intercepted requests have resolved
    And the User force clicks on the Element with Cypress ID "organization-unit-dropdown-item-delete-organizational-unit"
    And the IAM Organization unit request has been intercepted to delete the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "006-deletable"
    And the IAM Organization units request has been intercepted to return the units of Organization "005"
    When the User clicks on the Element with Cypress ID "button-delete-organization-unit-submit"
    And the intercepted requests have resolved
    Then the Element with Cypress ID "tree-item-id-01234567-89ab-cdef-0123-456789abcdef" should NOT exist

  Scenario: User should be redirected to Organization Unit parent after deleting Organization Unit
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "011"
    And the IAM Organization units request has been intercepted to return the units of Organization "011"
    And the IAM Organization unit request has been intercepted to return the unit "11234567-89ab-cdef-0123-456789abcdef" of Organization "011"
    And the User navigates to "/sc/units/11234567-89ab-cdef-0123-456789abcdef"
    And the intercepted requests have resolved
    And the User force clicks on the Element with Cypress ID "organization-unit-dropdown"
    And the User force clicks on the Element with Cypress ID "organization-unit-dropdown-item-delete-organizational-unit"
    And the IAM Organization unit request has been intercepted to delete the unit "11234567-89ab-cdef-0123-456789abcdef" of Organization "011"
    When the User clicks on the Element with Cypress ID "button-delete-organization-unit-submit"
    Then the User should be redirected to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"

  Scenario: User should be redirected to fist Organization Unit after deleting Organization Unit without parent
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "011-no-parent"
    And the IAM Organization units request has been intercepted to return the units of Organization "011-no-parent"
    And the IAM Organization unit request has been intercepted to return the unit "11234567-89ab-cdef-0123-456789abcdef" of Organization "011-no-parent"
    And the User navigates to "/sc/units/11234567-89ab-cdef-0123-456789abcdef"
    And the intercepted requests have resolved
    And the User force clicks on the Element with Cypress ID "organization-unit-dropdown"
    And the User force clicks on the Element with Cypress ID "organization-unit-dropdown-item-delete-organizational-unit"
    And the IAM Organization unit request has been intercepted to delete the unit "11234567-89ab-cdef-0123-456789abcdef" of Organization "011-no-parent"
    When the User clicks on the Element with Cypress ID "button-delete-organization-unit-submit"
    Then the User should be redirected to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"

  Scenario: Delete Organization Unit option in Organization Unit dropdown  should be disabled if Organization Unit is not deletable
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "005-non-deletable"
    And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    And the intercepted requests have resolved
    When the User force clicks on the Element with Cypress ID "organization-unit-dropdown"
    Then the Element with Cypress ID "organization-unit-dropdown-item-delete-organizational-unit" should have a class "mm-dropdown-item--disabled"

  Scenario: Organization Unit dropdown item Delete Organization Unit should have hint if Organization Unit has users or children
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "011-no-users"
    And the IAM Organization units request has been intercepted to return the units of Organization "011-no-users"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "011-no-users"
    And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    And the intercepted requests have resolved
    When the User force clicks on the Element with Cypress ID "organization-unit-dropdown"
    Then the Element with Cypress ID "organization-unit-dropdown-item-hint" should exist

  Scenario: Organization Unit dropdown item Delete Organization Unit should have correct text in hint if Organization Unit has users or children
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "011-no-users"
    And the IAM Organization units request has been intercepted to return the units of Organization "011-no-users"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "011-no-users"
    And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    And the intercepted requests have resolved
    When the User force clicks on the Element with Cypress ID "organization-unit-dropdown"
    Then the Element with Cypress ID "organization-unit-dropdown-item-hint" contains the text as "You cannot delete this unit because it has sub-units or users or you do not have the required permissions"

  Scenario: User should be redirected to first Organization Unit if User navigates to empty Organization Units page
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    When the User navigates to "/sc/units/empty"
    Then the User should be redirected to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"

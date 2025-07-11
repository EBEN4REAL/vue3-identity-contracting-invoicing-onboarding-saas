Feature: Access Management - Units - Edit

  Scenario: Button Edit Organization Unit exists
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    Then the Element with Cypress ID "button-edit-organization-unit" should exist

  Scenario: Edit Organization Unit mode opens after User clicks on Button Edit Organization Unit
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    When the User clicks on the Element with Cypress ID "button-edit-organization-unit"
    Then the Element with Cypress ID "organization-unit-edit-mode" should exist

  Scenario: Edit Organization Unit mode closes after User clicks on Button Dismiss
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    And the User clicks on the Element with Cypress ID "button-edit-organization-unit"
    And the Element with Cypress ID "organization-unit-edit-mode" should exist
    When the User clicks on the Element with Cypress ID "button-dismiss"
    Then the Element with Cypress ID "organization-unit-edit-mode" should NOT exist

  Scenario: Edit Organization Unit field Organization Unit Name should have correct value
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    When the User clicks on the Element with Cypress ID "button-edit-organization-unit"
    Then the Input with Cypress ID "input-organization-unit-name" should have value as "Unit 1"

  Scenario: Edit Organization Unit field Organization Unit Description should have correct value
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    When the User clicks on the Element with Cypress ID "button-edit-organization-unit"
    Then the Textarea with Cypress ID "input-organization-unit-description" should have value as "unit 1 Description"

  Scenario: Edit Organization Unit mode closes after successful updating Organization Unit field name
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    And the User clicks on the Element with Cypress ID "button-edit-organization-unit"
    And the User types "Unit 1 NEW" in Input inside Element with Cypress ID "input-organization-unit-name"
    And the IAM Organization unit request has been intercepted to update field "name" with value "Unit 1 NEW" and return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    When the User clicks on the Element with Cypress ID "button-save-changes"
    Then the Element with Cypress ID "organization-unit-edit-mode" should NOT exist

  Scenario: Edit Organization Unit mode closes after successful updating Organization Unit field description
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    And the User clicks on the Element with Cypress ID "button-edit-organization-unit"
    And the User types "Unit 1 Description NEW" in Textarea inside Element with Cypress ID "input-organization-unit-description"
    And the IAM Organization unit request has been intercepted to update field "description" with value "Unit 1 Description NEW" and return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    When the User clicks on the Element with Cypress ID "button-save-changes"
    Then the Element with Cypress ID "organization-unit-edit-mode" should NOT exist

  Scenario: Data iterator has correct Organization Unit parent after successful updating Organization Unit field parent
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "011-no-parent"
    And the IAM Organization units request has been intercepted to return the units of Organization "011-no-parent"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "011-no-parent"
    And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    And the User clicks on the Element with Cypress ID "button-edit-organization-unit"
    And the User selects option with Cypress ID "mm-select-option-11234567-89ab-cdef-0123-456789abcdef" in the Select with Cypress ID "select-organization-unit-parent"
    And the IAM Organization unit request has been intercepted to update field "parent_organization_unit_id" with value "11234567-89ab-cdef-0123-456789abcdef" and return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    When the User clicks on the Element with Cypress ID "button-save-changes"
    Then the Element with Cypress ID "parent mm-data-iterator-item-text" contains the text as "Unit 2"

  Scenario: Data iterator Organization Unit parent is successfully updated to the organization after selecting the main organization as the parent of the edited unit
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "011-no-parent"
    And the IAM Organization units request has been intercepted to return the units of Organization "011-no-parent"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "011-no-parent"
    And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    And the User clicks on the Element with Cypress ID "button-edit-organization-unit"
    And the User selects option with Cypress ID "mm-select-option-4a6f01d0-f3c6-4923-ad98-112d6d97355b" in the Select with Cypress ID "select-organization-unit-parent"
    And the IAM Organization unit request has been intercepted to update field "parent_organization_unit_id" with value "4a6f01d0-f3c6-4923-ad98-112d6d97355b" and return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    When the User clicks on the Element with Cypress ID "button-save-changes"
    Then the Element with Cypress ID "parent mm-data-iterator-item-text" contains the text as "Org 001"

  Scenario: Data iterator has correct Organization Unit name after successful updating Organization Unit field name
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    And the User clicks on the Element with Cypress ID "button-edit-organization-unit"
    And the User types "Unit 1 NEW" in Input inside Element with Cypress ID "input-organization-unit-name"
    And the IAM Organization unit request has been intercepted to update field "name" with value "Unit 1 NEW" and return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    When the User clicks on the Element with Cypress ID "button-save-changes"
    Then the Element with Cypress ID "org-unit-name mm-data-iterator-item-text" contains the text as "Unit 1 NEW"

  Scenario: Header title is correct after successful updating Organization Unit field name
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    
    And the User clicks on the Element with Cypress ID "button-edit-organization-unit"
    And the User types "Unit 1 NEW" in Input inside Element with Cypress ID "input-organization-unit-name"
    And the IAM Organization unit request has been intercepted to update field "name" with value "Unit 1 NEW" and return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    When the User clicks on the Element with Cypress ID "button-save-changes"
    Then the Element with Cypress ID "header-title" contains the text as "Unit 1 NEW"

  Scenario: Header subtitle is correct after successful updating Organization Unit field description
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    And the User clicks on the Element with Cypress ID "button-edit-organization-unit"
    And the User types "Unit 1 Description NEW" in Textarea inside Element with Cypress ID "input-organization-unit-description"
    And the IAM Organization unit request has been intercepted to update field "name" with value "Unit 1 NEW" and return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    When the User clicks on the Element with Cypress ID "button-save-changes"
    Then the Element with Cypress ID "header-subtitle" contains the text as "Unit 1 Description NEW"

  Scenario: Organization Units Tree has correct Organization Units Tree Item after successful updating Organization Unit field name
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    And the User clicks on the Element with Cypress ID "button-edit-organization-unit"
    And the User types "Unit 1 NEW" in Input inside Element with Cypress ID "input-organization-unit-name"
    And the IAM Organization unit request has been intercepted to update field "name" with value "Unit 1 NEW" and return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    When the User clicks on the Element with Cypress ID "button-save-changes"
    Then the Element with Cypress ID "tree-item-id-01234567-89ab-cdef-0123-456789abcdef-label" contains the text as "Unit 1 NEW"

  Scenario: Data iterator has correct Organization Unit description after successful updating Organization Unit field description
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    And the User clicks on the Element with Cypress ID "button-edit-organization-unit"
    And the User types "Unit 1 Description NEW" in Textarea inside Element with Cypress ID "input-organization-unit-description"
    And the IAM Organization unit request has been intercepted to update field "name" with value "Unit 1 NEW" and return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    When the User clicks on the Element with Cypress ID "button-save-changes"
    Then the Element with Cypress ID "description mm-data-iterator-item-text" contains the text as "Unit 1 Description NEW"

  Scenario: Field name shows error after clearing and clicking outside in Edit Organization Unit mode
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    And the User clicks on the Element with Cypress ID "button-edit-organization-unit"
    And the User clears the Input inside Element with Cypress ID "input-organization-unit-name"
    When the User clicks outside
    Then the Element with Cypress ID "input-organization-unit-name" should have a Form Error for validator "required" with text "Organization unit name is required"

  Scenario: User receives error 409 after submitting already existing Organization Unit Name
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    And the User clicks on the Element with Cypress ID "button-edit-organization-unit"
    And the User types "Unit 1 NEW" in Input inside Element with Cypress ID "input-organization-unit-name"
    And the IAM Organization unit update request has been intercepted to to return error 409 for the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    When the User clicks on the Element with Cypress ID "button-save-changes"
    Then the Element with Cypress ID "alert-organization-unit-update" should exist
    And the Element with Cypress ID "alert-organization-unit-update" should have the text as "This unit name is already in use"

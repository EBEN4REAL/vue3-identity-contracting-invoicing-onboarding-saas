Feature: Access Management - User - Details - Update

  Scenario: Button Edit should exist for MMAdmin
    Given the User "MMAdmin001" is Signed In
    And the IAM Users request has been intercepted to return the Users "002"
    And the IAM Organization User request has been intercepted to return the User "002" from Organization "001"
    When the User navigates to "/sc/users/ded35af8-c60c-4f98-b35b-64db59deb4a7"
    Then the Element with Cypress ID "button-edit-organization-user" should exist

  Scenario: Button Edit should exist for Editor
    Given the User "004" is Signed In
    And the IAM Users request has been intercepted to return the Users "002"
    And the IAM Organization User request has been intercepted to return the User "002" from Organization "001"
    When the User navigates to "/sc/users/ded35af8-c60c-4f98-b35b-64db59deb4a7"
    Then the Element with Cypress ID "button-edit-organization-user" should exist

  Scenario: Button Edit should not exist for Viewer
    Given the User "005" is Signed In
    And the IAM Users request has been intercepted to return the Users "002"
    And the IAM Organization User request has been intercepted to return the User "002" from Organization "001"
    When the User navigates to "/sc/users/ded35af8-c60c-4f98-b35b-64db59deb4a7"
    Then the Element with Cypress ID "button-edit-organization-user" should NOT exist

  Scenario: Button Edit should open edit mode for MMAdmin
    Given the User "MMAdmin001" is Signed In
    And the IAM Users request has been intercepted to return the Users "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization User request has been intercepted to return the User "001" from Organization "001"
    And the User navigates to "/sc/users/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    When the User clicks on the Element with Cypress ID "button-edit-organization-user"
    Then the Element with Cypress ID "edit-mode" should exist

  Scenario: Button Dismiss should close edit mode for MMAdmin
    Given the User "MMAdmin001" is Signed In
    And the IAM Users request has been intercepted to return the Users "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization User request has been intercepted to return the User "001" from Organization "001"
    And the User navigates to "/sc/users/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User clicks on the Element with Cypress ID "button-edit-organization-user"
    When the User clicks on the Element with Cypress ID "button-dismiss"
    Then the Element with Cypress ID "edit-mode" should NOT exist

  Scenario: Successfully change Job Role as MMAdmin
    Given the User "MMAdmin001" is Signed In
    And the IAM Users request has been intercepted to return the Users "MMAdmin001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization User request has been intercepted to return the User "001" from Organization "001"
    And the User navigates to "/sc/users/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User clicks on the Element with Cypress ID "button-edit-organization-user"
    Then the Element with Cypress ID "select-job_role" should exist
    And the User selects option with Cypress ID "mm-select-option-MARKETING" in the Select with Cypress ID "select-job_role"
    And the IAM Organization User "001" from Organization "004" Update request with field "job_role" and value "MAR" has been intercepted
    When the User clicks on the Element with Cypress ID "button-save-changes"
    Then the Element with Cypress ID "job-role user-detail-item-text" should have the text as "Marketing"

  Scenario: Organization unit Select should be disabled when no Organization units added to Organization
    Given the User "MMAdmin001" is Signed In
    And the IAM User request has been intercepted to return the User "009-no-unit"
    And the IAM User @me request has been intercepted to return the User "MMAdmin001"
    And the IAM Organization User request has been intercepted to return the User "009-no-unit" from Organization "004"
    And the IAM Organization units request has been intercepted to return no units for Organization "001"
    And the User navigates to "/sc/users/9ae6a77f-718b-4764-bf9a-5fa72b61896d"
    When the User clicks on the Element with Cypress ID "button-edit-organization-user"
    Then the Element with Cypress ID "select-organization_unit_id" should have a class "mm-select mm-select--disabled"

  Scenario: Organization unit Select should have correct placeholder when Organization has no units
    Given the User "MMAdmin001" is Signed In
    And the IAM User request has been intercepted to return the User "009-no-unit"
    And the IAM User @me request has been intercepted to return the User "MMAdmin001"
    And the IAM Organization User request has been intercepted to return the User "009-no-unit" from Organization "004"
    And the IAM Organization units request has been intercepted to return no units for Organization "001"
    And the User navigates to "/sc/users/9ae6a77f-718b-4764-bf9a-5fa72b61896d"
    When the User clicks on the Element with Cypress ID "button-edit-organization-user"
    Then the Element with Cypress ID "select-organization_unit_id mm-select-placeholder" should have the text as "No Organization Units found"

  Scenario: Organization unit Select should have correct placeholder when Organization has units
    Given the User "MMAdmin001" is Signed In
    And the IAM User request has been intercepted to return the User "009-no-unit"
    And the IAM User @me request has been intercepted to return the User "MMAdmin001"
    And the IAM Organization User request has been intercepted to return the User "009-no-unit" from Organization "004"
    And the IAM Organization units request has been intercepted to return the units of Organization "004"
    And the User navigates to "/sc/users/9ae6a77f-718b-4764-bf9a-5fa72b61896d"
    When the User clicks on the Element with Cypress ID "button-edit-organization-user"
    Then the Element with Cypress ID "select-organization_unit_id mm-select-placeholder" should have the text as "Select Organization unit"

  Scenario: Organization unit Select should have correct pre selected Organization Unit when Organization has units
    Given the User "MMAdmin001" is Signed In
    And the IAM User request has been intercepted to return the User "009-with-unit"
    And the IAM User @me request has been intercepted to return the User "MMAdmin001"
    And the IAM Organization User request has been intercepted to return the User "009-with-unit" from Organization "004"
    And the IAM Organization units request has been intercepted to return the units of Organization "004"
    And the User navigates to "/sc/users/9ae6a77f-718b-4764-bf9a-5fa72b61896d"
    When the User clicks on the Element with Cypress ID "button-edit-organization-user"
    Then the Element with Cypress ID "select-organization_unit_id mm-select-value-01234567-89ab-cdef-0123-456789abcdef" should have the text as " Unit 1"

  Scenario: Successfully change Organization Unit as MMAdmin
    Given the User "MMAdmin001" is Signed In
    And the IAM User request has been intercepted to return the User "009-with-unit"
    And the IAM User @me request has been intercepted to return the User "MMAdmin001"
    And the IAM Organization User request has been intercepted to return the User "009-with-unit" from Organization "004"
    And the IAM Organizations request has been intercepted to return the Organizations "004"
    And the IAM Organization units request has been intercepted to return the units of Organization "004"
    And the User navigates to "/sc/users/9ae6a77f-718b-4764-bf9a-5fa72b61896d"
    And the User clicks on the Element with Cypress ID "button-edit-organization-user"
    And the User selects option with Cypress ID "mm-select-option-01234567-89ab-cdef-0123-456789abcdef" in the Select with Cypress ID "select-organization_unit_id"
    And the IAM Organization User "009-with-unit" from Organization "004" Update request with field "organization_unit_id" and value "01234567-89ab-cdef-0123-456789abcdef" has been intercepted
    When the User clicks on the Element with Cypress ID "button-save-changes"
    Then the Element with Cypress ID "org-unit user-detail-item-text" should have the text as "Unit 1"

  Scenario: Organization unit Select should have new option No Organization Unit
    Given the User "MMAdmin001" is Signed In
    And the IAM User request has been intercepted to return the User "009-with-unit"
    And the IAM User @me request has been intercepted to return the User "MMAdmin001"
    And the IAM Organization User request has been intercepted to return the User "009-with-unit" from Organization "004"
    And the IAM Organizations request has been intercepted to return the Organizations "004"
    And the IAM Organization units request has been intercepted to return the units of Organization "004"
    And the User navigates to "/sc/users/9ae6a77f-718b-4764-bf9a-5fa72b61896d"
    When the User clicks on the Element with Cypress ID "button-edit-organization-user"
    Then the Element with Cypress ID "select-organization_unit_id" should exist
    And the User selects option with Cypress ID "mm-select-option--1" in the Select with Cypress ID "select-organization_unit_id"
    Then the Element with Cypress ID "mm-select-value--1" should have the text as " No Organization Unit"

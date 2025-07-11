Feature: Access Management - Unit - Users

  Scenario: Organization Unit Users Table should exist
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    When the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    And the User clicks on the Element with Cypress ID "tab-item-users"
    Then the Element with Cypress ID "table-organization-unit-users" should exist

  Scenario: Should be possible to sort by user name
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    And the IAM Organization request has been intercepted to return the users of Unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001" with userId "001,004"
    When the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    And the User clicks on the Element with Cypress ID "tab-item-users"
    Then the Element with Cypress ID "sort-icon-name" should have a class "mm-table-header-cell--icon-focused"
    Then the Element with Cypress ID "table-organization-unit-users row-0 name" should have the text as "test test"
    And the IAM Organization request has been intercepted to return the users of Unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001" with userId "004,001"
    Then the User clicks on the Element with Cypress ID "sort-icon-name"
    Then the Element with Cypress ID "sort-icon-name" should NOT have a class "mm-table-header-cell--icon-focused"
    And the Element with Cypress ID "table-organization-unit-users row-0 name" should have the text as "User 004"

  Scenario: Organization Unit Users Table should have User
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    And the IAM Organization request has been intercepted to return the users of Unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001" with userId "001"
    When the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    And the User clicks on the Element with Cypress ID "tab-item-users"
    Then the Element with Cypress ID "table-organization-unit-users row-0" should exist

  Scenario: Organization Unit Users Table should have User with correct name
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    And the IAM Organization request has been intercepted to return the users of Unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001" with userId "001"
    When the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    And the User clicks on the Element with Cypress ID "tab-item-users"
    Then the Element with Cypress ID "table-organization-unit-users row-0 name" should have the text as "test test"

  Scenario: Organization Unit Users Table should have dropdown with option Remove user and View User
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    And the IAM Organization request has been intercepted to return the users of Unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001" with userId "001"
    And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    And the User clicks on the Element with Cypress ID "tab-item-users"
    When the User clicks on the Element with Cypress ID "table-organization-unit-users row-0 button-organization-unit-user-dropdown"
    Then the Element with Cypress ID "dropdown-item-remove-user" should exist
    Then the Element with Cypress ID "dropdown-item-view-user" should exist

  Scenario: Confirm removing User from Unit Dialog should exist
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    And the IAM Organization request has been intercepted to return the users of Unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001" with userId "001"
    And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    And the User clicks on the Element with Cypress ID "tab-item-users"
    And the User clicks on the Element with Cypress ID "table-organization-unit-users row-0 button-organization-unit-user-dropdown"
    When the User clicks on the Element with Cypress ID "dropdown-item-remove-user"
    Then the Element with Cypress ID "organization-unit-user-dialog-delete" should exist

  Scenario: Confirm removing User from Unit Dialog should have correct title
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    And the IAM Organization request has been intercepted to return the users of Unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001" with userId "001"
    And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    And the User clicks on the Element with Cypress ID "tab-item-users"
    And the User clicks on the Element with Cypress ID "table-organization-unit-users row-0 button-organization-unit-user-dropdown"
    When the User clicks on the Element with Cypress ID "dropdown-item-remove-user"
    Then the Element with Cypress ID "organization-unit-user-dialog-delete dialog-title" should have the text as "Remove test test"

  Scenario: Confirm removing User from Unit Dialog should have correct subtitle
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    And the IAM Organization request has been intercepted to return the users of Unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001" with userId "001"
    And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    And the User clicks on the Element with Cypress ID "tab-item-users"
    And the User clicks on the Element with Cypress ID "table-organization-unit-users row-0 button-organization-unit-user-dropdown"
    When the User clicks on the Element with Cypress ID "dropdown-item-remove-user"
    Then the Element with Cypress ID "organization-unit-user-dialog-delete dialog-subtitle" should have the text as "Are you sure you want to remove test test from unit Unit 1?"

  Scenario: Confirm removing User from Unit Dialog should not exist after pressing Dismiss button
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    And the IAM Organization request has been intercepted to return the users of Unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001" with userId "001"
    And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    And the User clicks on the Element with Cypress ID "tab-item-users"
    And the User clicks on the Element with Cypress ID "table-organization-unit-users row-0 button-organization-unit-user-dropdown"
    And the User clicks on the Element with Cypress ID "dropdown-item-remove-user"
    When the User clicks on the Element with Cypress ID "button-remove-user-from-unit-dismiss"
    Then the Element with Cypress ID "organization-unit-user-dialog-delete" should NOT exist

  Scenario: User should be removed from Unit
    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    And the IAM Organization request has been intercepted to return the users of Unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001" with userId "001"
    And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    And the User clicks on the Element with Cypress ID "tab-item-users"
    And the User clicks on the Element with Cypress ID "table-organization-unit-users row-0 button-organization-unit-user-dropdown"
    And the User clicks on the Element with Cypress ID "dropdown-item-remove-user"
    And the IAM Organization unit request has been intercepted to remove user "4a5df159-f5c8-4062-bebb-6ba8305ec552" from unit "01234567-89ab-cdef-0123-456789abcdef" within organization "001"
    And the IAM Organization request has been intercepted to return the users of Unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001" with userId "004"
    When the User clicks on the Element with Cypress ID "button-remove-user-from-unit-submit"
    Then the Element with Cypress ID "table-organization-unit-users row-0" DOES NOT contain the text as "test test"

  Scenario: User should go to the User Details Overview page
    Given the User "003" is Signed In
    And the IAM User @me request has been intercepted to return the User "003"
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization Users request has been intercepted to return Users "001" from Organization "001"
    And the IAM Organization Groups request has been intercepted to return the Groups "" from Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    And the IAM Organization request has been intercepted to return the users of Unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001" with userId "001"
    And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    And the User clicks on the Element with Cypress ID "tab-item-users"
    And the User clicks on the Element with Cypress ID "table-organization-unit-users row-0 button-organization-unit-user-dropdown"
    And the Element with Cypress ID "dropdown-item-view-user" should exist
    And the IAM Organization User request has been intercepted to return the Organization User "001"
    When the User clicks on the Element with Cypress ID "dropdown-item-view-user"
    Then the User should be redirected to "/sc/users/4a5df159-f5c8-4062-bebb-6ba8305ec552"

  Scenario: Button for adding users to Unit should exist
    Given the User "005" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    When the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    And the IAM Organization request has been intercepted to return the users of Unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001" with userId "001"
    And the User clicks on the Element with Cypress ID "tab-item-users"
    Then the Element with Cypress ID "add-user-button" should exist

  Scenario: Dialog for adding users to group should exist
    Given the User "005" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    And the IAM Organization request has been intercepted to return the users of Unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001" with userId "001"
    And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    And the User clicks on the Element with Cypress ID "tab-item-users"
    When the User clicks on the Element with Cypress ID "add-user-button"
    Then the Element with Cypress ID "add-user-dialog" should exist
    And the Element with Cypress ID "button-remove-user" should NOT exist

  Scenario: Invite hint should exist
    Given the User "005" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    And the IAM Organization request has been intercepted to return the users of Unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001" with userId "001,002"
    And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
    And the IAM Users request has been intercepted to return the Users "011"
    And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    And the User clicks on the Element with Cypress ID "tab-item-users"
    And the User clicks on the Element with Cypress ID "add-user-button"
    When the User clicks on the Element with Cypress ID "user-ids-autocomplete autocomplete"
    Then the Element with Cypress ID "autocomplete-options-hint" should exist

  Scenario: Clicking on invite button opens invite modal
    Given the User "005" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    And the IAM Organization request has been intercepted to return the users of Unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001" with userId "001"
    And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
    And the IAM Users request has been intercepted to return the Users "011"
    And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    And the User clicks on the Element with Cypress ID "tab-item-users"
    And the User clicks on the Element with Cypress ID "add-user-button"
    And the User clicks on the Element with Cypress ID "user-ids-autocomplete autocomplete"
    When the User force clicks on the Element with Cypress ID "button-open-dialog-invite-users"
    Then the Element with Cypress ID "dialog-invite-organization-users" should exist

  Scenario: Refreshing users list after inviting user
    Given the User "005" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    And the IAM Organization request has been intercepted to return the users of Unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001" with userId "001"
    And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
    And the IAM Users request has been intercepted to return the Users "011"
    And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    And the User clicks on the Element with Cypress ID "tab-item-users"
    And the User clicks on the Element with Cypress ID "add-user-button"
    And the User clicks on the Element with Cypress ID "user-ids-autocomplete autocomplete"
    And the User force clicks on the Element with Cypress ID "button-open-dialog-invite-users"
    And the User types "email@test.com" in Input inside Element with Cypress ID "invite-users-form-emails"
    When the User clicks on the Element with Cypress ID "invite-users-form-submit-button"
    Then the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"

  Scenario: Alert for users who has already units should be visible
    Given the User "005" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization unit request has been intercepted to return the unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001"
    And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
    And the IAM Organization request has been intercepted to return the users of Unit "01234567-89ab-cdef-0123-456789abcdef" of Organization "001" with userId "001"
    And the User navigates to "/sc/units/01234567-89ab-cdef-0123-456789abcdef"
    And the User clicks on the Element with Cypress ID "tab-item-users"
    And the User clicks on the Element with Cypress ID "add-user-button"
    And the Element with Cypress ID "add-user-dialog" should exist
    And the User clicks on the Element with Cypress ID "user-ids-autocomplete autocomplete"
    When the User clicks on the Element with Cypress ID "mm-autocomplete-option-4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    Then the Element with Cypress ID " duplicate-user-alert" should be visible


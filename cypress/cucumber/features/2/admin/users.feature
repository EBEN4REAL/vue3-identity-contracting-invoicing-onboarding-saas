Feature: Admin - Users

  Scenario: Forbidden

    Given the User "002" is Signed In
    When the User navigates to "/sc/admin/users"
    Then the Element with Cypress ID "users-overview-admin-table" should NOT exist
    Then the Element with selector "#title" should have the text as "404"

  Scenario: Success

    Given the User "MMAdmin001" is Signed In
    And the IAM Users request has been intercepted to return the Users "001,002"
    When the User navigates to "/sc/admin/users"
    Then the Element with Cypress ID "users-overview-admin-table" should be visible

  Scenario: Verify that Name and Email search work as expected
    Given the User "MMAdmin001" is Signed In
    And the IAM Users request has been intercepted to return the Users "001,002"
    And the User navigates to "/sc/admin/users"
    And the IAM Users request has been intercepted to return the Users "001,002"
    And the IAM Users request has been intercepted to return the Users "001,002" with query params "generic_email_name_search=001"
    When the User types "001" in the Element with Cypress ID "filter"
    Then the Element with Cypress ID "row-0" should exist
    And the Element with Cypress ID "row-0 name" should have the text as "User 001"
    And the IAM Users request has been intercepted to return the Users "001,002" with query params "generic_email_name_search=User001@email.com"
    And the User types "User001@email.com" in the Element with Cypress ID "filter"
    And the Element with Cypress ID "row-0 email" should have the text as "User001@email.com"

  Scenario: Verify that Sorting exists and pagination works as expected
    Given the User "MMAdmin001" is Signed In
    And the IAM Users request has been intercepted to return the Users "001,002,003,005,012,013,014,015,016,017,018,019,020"
    And the User navigates to "/sc/admin/users"
    And the IAM Users request has been completed
    And the Element with Cypress ID "sort-icon-name" should have a class "mm-table-header-cell--icon-focused"
    And the Element with Cypress ID "pagination" should be visible
    And the User clicks on the Element with Cypress ID "next-page"
    And the IAM Users request has been intercepted to return the Users "018,019,020"
    And the Element with Cypress ID "row-0" should exist
    And the IAM Users request has been intercepted to return the Users "020,019,018"
    And the User clicks on the Element with Cypress ID "sort-icon-name"
    Then the Element with Cypress ID "sort-icon-name" should NOT have a class "mm-table-header-cell--icon-focused"
    Then the Element with Cypress ID "row-0 name" should have the text as "User 002"
  
  Scenario: Should be able to reset admin user password successfully
    Given the User "MMAdmin001" is Signed In
    And the IAM Users request has been intercepted to return the Users "001,002"
    And the IAM User @me request has been intercepted to return the User "MMAdmin001"
    And the User navigates to "/sc/admin/users"
    When the User clicks on the Element with Cypress ID "users-overview-admin-table row-0 actions"
    And the User force clicks on the Element with Cypress ID "actions-dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b-item-reset-password"
    And the Element with Cypress ID "dialog-confirm-reset-password" should be visible
    And the IAM User "001" Reset Password request has been intercepted
    And the User clicks on the Element with Cypress ID "button-reset-password"
    And the IAM User password reset request has been completed
    Then the Element with Cypress ID "dialog-confirm-reset-password" should NOT exist

  Scenario: Should be able to reset admin user TOTP successfully
    Given the User "MMAdmin001" is Signed In
    And the IAM Users request has been intercepted to return the Users "001,002"
    And the IAM User @me request has been intercepted to return the User "MMAdmin001"
    And the User navigates to "/sc/admin/users"
    When the User clicks on the Element with Cypress ID "users-overview-admin-table row-0 actions"
    And the User force clicks on the Element with Cypress ID "actions-dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b-item-reset-totp"
    Then the Element with Cypress ID "dialog-confirm-reset-totp" should be visible
    And the IAM User "001" Reset TOTP request has been intercepted
    And the User clicks on the Element with Cypress ID "button-reset-totp"
    And the IAM User TOTP reset request has been completed
    And the Element with Cypress ID "dialog-confirm-reset-totp" should NOT exist
  
  Scenario: Admin users list should return the correct list when applying Active status filter 
    Given the User "MMAdmin001" is Signed In
    And the IAM Users request has been intercepted to return the Users "001,002"
    And the User navigates to "/sc/admin/users"
    And the IAM Users request has been completed
    And the User clicks on the Element with Cypress ID "dropdown" 
    And the User clicks on the Element with Cypress ID "checkbox-table-filter-is_active" 
    And the IAM Users request has been intercepted to return the Users "001" with query params "sort=first_name%3Aasc&is_active=true"
    And the User clicks on the Element with Cypress ID "button-apply-filters"  
    When the IAM Users request has been completed with query params "sort=first_name%3Aasc&is_active=true"
    Then the Element with Cypress ID "row-0" should exist
    And the Element with Cypress ID "admin-user-status" contains the text as "Active"
  
  Scenario: Admin users list should return the correct list when applying Inactive status filter 
    Given the User "MMAdmin001" is Signed In
    And the IAM Users request has been intercepted to return the Users "001,002"
    And the User navigates to "/sc/admin/users"
    And the IAM Users request has been completed
    And the User clicks on the Element with Cypress ID "dropdown" 
    And the User clicks on the Element with Cypress ID "checkbox-table-filter-is_not_active" 
    And the IAM Users request has been intercepted to return the Users "002" with query params "sort=first_name%3Aasc&is_active=false"
    And the User clicks on the Element with Cypress ID "button-apply-filters"  
    When the IAM Users request has been completed with query params "sort=first_name%3Aasc&is_active=false"
    Then the Element with Cypress ID "row-0" should exist
    And the Element with Cypress ID "admin-user-status" contains the text as "Inactive"

  Scenario: Should be able disable admin user successfully
    Given the User "MMAdmin001" is Signed In
    And the IAM Users request has been intercepted to return the Users "001,002"
    And the IAM User @me request has been intercepted to return the User "MMAdmin001"
    And the User navigates to "/sc/admin/users"
    When the User force clicks on the Element with Cypress ID "users-overview-admin-table row-0 actions"
    And the User force clicks on the Element with Cypress ID "actions-dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b-item-disable-user"
    And the Element with Cypress ID "dialog-confirm-disable-user" should be visible
    And the IAM disable User request has been intercepted for User "001"
    And the User force clicks on the Element with Cypress ID "disable-user-button"
    And the IAM disable User request has been completed
    Then the Element with Cypress ID "dialog-confirm-disable-user" should NOT exist

  Scenario: Disable user menu item should be hidden for current user
    Given the User "MMAdmin001" is Signed In
    And the IAM Users request has been intercepted to return the Users "001"
    And the IAM User @me request has been intercepted to return the User "001"
    When the User navigates to "/sc/admin/users"
    Then the Element with Cypress ID "actions-dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b-item-enable-user" should NOT exist

  Scenario: Dialog confirm disable user
    Given the User "MMAdmin001" is Signed In
    And the IAM Users request has been intercepted to return the Users "001"
    And the IAM User @me request has been intercepted to return the User "MMAdmin001"
    And the User navigates to "/sc/admin/users"
    And the intercepted requests have resolved
    And the User force clicks on the Element with Cypress ID "users-overview-admin-table row-0 actions"
    When the User force clicks on the Element with Cypress ID "actions-dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b-item-disable-user"
    Then the Element with Cypress ID "dialog-confirm-disable-user" should exist

  Scenario: Dialog confirm enable user
    Given the User "MMAdmin001" is Signed In
    And the IAM Users request has been intercepted to return the Users "001-disabled"
    And the IAM User @me request has been intercepted to return the User "MMAdmin001"
    And the User navigates to "/sc/admin/users"
    And the User force clicks on the Element with Cypress ID "users-overview-admin-table row-0 actions"
    Then the Element with Cypress ID "actions-dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b-item-enable-user" should exist
    When the User force clicks on the Element with Cypress ID "actions-dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b-item-enable-user"
    Then the Element with Cypress ID "dialog-confirm-enable-user" should exist

  Scenario: Remove user from Admin Users List
    Given the User "MMAdmin001" is Signed In
    And the IAM Users request has been intercepted to return the Users "001-without-organization"
    And the IAM User @me request has been intercepted to return the User "MMAdmin001"
    And the User navigates to "/sc/admin/users"
    And the intercepted requests have resolved
    When the User force clicks on the Element with Cypress ID "users-overview-admin-table row-0 actions"
    And the User force clicks on the Element with Cypress ID "actions-dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b-item-delete-user"
    And the IAM Organization delete Organization User with ID "001" from Organization "001" request has been intercepted
    And the IAM DELETE Admin User with ID "001" request has been intercepted    
    When the User force clicks on the Element with Cypress ID "dialog-confirm-remove-user-from-organization button-submit"
    And Admin User has been deleted successfuly
    Then the Element with Cypress ID "dialog-confirm-remove-user-from-organization" should NOT exist

Feature: Admin - User

  Scenario: Forbidden with non-Admin User

    Given the User "002" is Signed In
    When the User navigates to "/sc/admin/users/ded35af8-c60c-4f98-b35b-64db59deb4a7"
    Then the Element with selector "#firstName" should NOT exist
    Then the Element with selector "#title" should have the text as "404"

  Scenario: Success with MM Admin from App Navigation and Users

    Given the User "MMAdmin001" is Signed In
    And the IAM Users request has been intercepted to return the Users "002"
    And the IAM User request has been intercepted to return the User "002"
    And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User clicks on the Element with selector "#app-navigation-admin-users"
    And the User should be redirected to "/sc/admin/users"
    And the Element with Cypress ID "row-0" should be visible
    When the User clicks on the Element with Cypress ID "name-link"
    Then the User should be redirected to "/sc/admin/users/ded35af8-c60c-4f98-b35b-64db59deb4a7"
    And the Element with Cypress ID "header-title" contains the text as "User 002"

  Scenario: Success with MM Admin from direct URL

    Given the User "MMAdmin001" is Signed In
    And the IAM User request has been intercepted to return the User "002"
    When the User navigates to "/sc/admin/users/ded35af8-c60c-4f98-b35b-64db59deb4a7"
    Then the Element with Cypress ID "header-title" should be visible
    And the Element with Cypress ID "header-title" contains the text as "User 002"

  Scenario: Check Reset Password Functionality

    Given the User "MMAdmin001" is Signed In
    And the IAM User request has been intercepted to return the User "002"
    And the User navigates to "/sc/admin/users/ded35af8-c60c-4f98-b35b-64db59deb4a7"
    And the User clicks on the Element with Cypress ID "user-details-actions"
    And the User clicks on the Element with Cypress ID "user-details-actions"
    When the User force clicks on the Element with Cypress ID "user-details-actions-item-reset-password"
    Then the Element with Cypress ID "dialog-confirm-reset-password" should be visible
  
  Scenario: Verify that Reset TOTP for Admin User is successful

    Given the User "MMAdmin001" is Signed In
    And the IAM User request has been intercepted to return the User "002"
    And the User navigates to "/sc/admin/users/ded35af8-c60c-4f98-b35b-64db59deb4a7"
    When the User clicks on the Element with Cypress ID "user-details-actions"
    And the User clicks on the Element with Cypress ID "user-details-actions"
    And the User force clicks on the Element with Cypress ID "user-details-actions-item-reset-totp"
    Then the Element with Cypress ID "dialog-confirm-reset-totp" should be visible
    And the IAM User "002" Reset TOTP request has been intercepted
    And the User clicks on the Element with Cypress ID "button-reset-totp"
    And the IAM User TOTP reset request has been completed
    And the Element with Cypress ID "dialog-confirm-reset-totp" should NOT exist

  Scenario: Success with View Organizations User is part of

    Given the User "MMAdmin001" is Signed In
    And the IAM User request has been intercepted to return the User "002"
    And the User navigates to "/sc/admin/users/ded35af8-c60c-4f98-b35b-64db59deb4a7"
    And the User clicks on the Element with Cypress ID "tab-item-organizations"
    Then the Element with Cypress ID "users-organizations-table" should exist
    And the Element with Cypress ID "row-0 org_name" should have the text as "Test org."

  Scenario: Success Delete User from Organization

    Given the User "MMAdmin001" is Signed In
    And the IAM User request has been intercepted to return the User "002"
    And the User navigates to "/sc/admin/users/ded35af8-c60c-4f98-b35b-64db59deb4a7"
    And the User clicks on the Element with Cypress ID "tab-item-organizations"
    Then the Element with Cypress ID "users-organizations-table" should exist
    And the User clicks on the Element with Cypress ID "actions-dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Element with Cypress ID "row-0 org_name" should have the text as "Test org."
    Then the User clicks on the Element with Cypress ID "actions-dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b-item-remove-user-from-organization"
    Then the Element with Cypress ID "dialog-confirm-remove-user-from-organization" should exist
    When the IAM Organization delete Organization User with ID "002" from Organization "001" request has been intercepted
    And the IAM User request has been intercepted to return the User "002WithoutOrganizations"
    Then the User clicks on the Element with Cypress ID "button-submit"
    Then the Element with Cypress ID "row-0" should NOT exist 
    
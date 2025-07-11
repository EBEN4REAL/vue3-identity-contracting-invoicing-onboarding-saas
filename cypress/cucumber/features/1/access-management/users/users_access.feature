Feature: Access Management - Users - Access

  Scenario: Forbidden with non-Org User
    Given the User "001OnboardingCompleted" is Signed In
    When the User navigates to "/sc/users"
    Then the Element with Cypress ID "organization-users-table" should NOT exist
    And the Element with selector "#title" should have the text as "404"

  Scenario: Success with Organization Viewer User from direct URL
    Given the User "005" is Signed In
    And the IAM Users request has been intercepted to return the Users "005"
    And the IAM Organization Groups request has been intercepted to return Groups "001,002,003" from Organization "001"
    And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
    And the User navigates to "/sc/users"
    Then the Element with Cypress ID "organization-users-table" should exist

  Scenario: Display correct data in Invites table and Last Invited On column should be updated after resending invite
    Given the User "005" is Signed In
    And the IAM Users request has been intercepted to return the Users "005"
    And the IAM Organization Groups request has been intercepted to return Groups "001,002,003" from Organization "001"
    And the IAM Organization Users request has been intercepted to return Users "001-invited-user,002,003" from Organization "001"
    And the User navigates to "/sc/users"
    And the User clicks on the Element with Cypress ID "tab-item-invites"
    And the intercepted requests have resolved
    Then the Element with Cypress ID "organization-users-table" should exist
    And the Element with Cypress ID "row-0 status_date" should have the formatted date as "8 Aug 2024, 09:46"
    And the Element with Cypress ID "row-2 status_date" should have the formatted date as "6 May 2024, 12:55"
    And the Element with Cypress ID "row-0 last_status_date" should have the formatted date as "26 Nov 2024, 13:46"
    And the User clicks on the Element with Cypress ID "dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the IAM Organization Users request has been intercepted to return Users "001-invited-user-updated" from Organization "001"
    And the User clicks on the Element with Cypress ID "dropdown-4a6f01d0-f3c6-4923-ad98-112d6d97355b-item-resend-invite"
    And the intercepted requests have resolved
    And the Element with Cypress ID "row-0 last_status_date" should have the formatted date as "26 Nov 2024, 14:46"   

  Scenario: Success with Organization Viewer User from App Navigation
    Given the User "005" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Users request has been intercepted to return the Users "005"
    And the IAM Organization Groups request has been intercepted to return Groups "001,002,003" from Organization "001"
    And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
    And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User force clicks on the Element with Cypress ID "mm-navigation-item-users"
    When the User should be redirected to "/sc/users"
    Then the Element with Cypress ID "organization-users-table" should exist

  Scenario: Should be possible to sort by user name
    Given the User "005" is Signed In
    And the IAM Users request has been intercepted to return the Users "005"
    And the IAM Organization Groups request has been intercepted to return Groups "001,002,003" from Organization "001"
    And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
    And the User navigates to "/sc/users"
    Then the Element with Cypress ID "sort-icon-name" should have a class "mm-table-header-cell--icon-focused"
    Then the Element with Cypress ID "row-0 name" should have the text as "User 001"
    And the IAM Organization Users request has been intercepted to return Users "003,002,001" from Organization "001"
    Then the User clicks on the Element with Cypress ID "sort-icon-name"
    Then the Element with Cypress ID "sort-icon-name" should NOT have a class "mm-table-header-cell--icon-focused"
    And the Element with Cypress ID "row-0 name" should have the text as "User 003"

   Scenario: Organization users list should return the correct list when applying Active status filter
    Given the User "005" is Signed In
    And the IAM Users request has been intercepted to return the Users "005"
    And the IAM Organization Groups request has been intercepted to return Groups "001,002,003" from Organization "001"
    And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
    And the User navigates to "/sc/users"
    And the intercepted requests have resolved
    And the User clicks on the Element with Cypress ID "dropdown"
    And the User clicks on the Element with Cypress ID "checkbox-table-filter-true"
    And the IAM Organization Users request has been intercepted to return Users "001,003" from Organization "001" with query params "sort=first_name:asc&active=true"
    And the User clicks on the Element with Cypress ID "button-apply-filters"
    When the IAM Organization Users request has been completed with query params "sort=first_name:asc&active=true"
    Then the Element with Cypress ID "row-0" should exist
    And the Element with Cypress ID "organization-user-status" contains the text as "Active"

  Scenario: Organization users list should return the correct list when applying Inactive status filter
    Given the User "005" is Signed In
    And the IAM Users request has been intercepted to return the Users "005"
    And the IAM Organization Groups request has been intercepted to return Groups "001,002,003" from Organization "001"
    And the IAM Organization Users request has been intercepted to return Users "001,002,003" from Organization "001"
    And the User navigates to "/sc/users"
    And the intercepted requests have resolved
    And the User clicks on the Element with Cypress ID "dropdown"
    And the User clicks on the Element with Cypress ID "checkbox-table-filter-false"
    And the IAM Organization Users request has been intercepted to return Users "002" from Organization "001" with query params "sort=first_name:asc&active=false"
    And the User clicks on the Element with Cypress ID "button-apply-filters"
    When the IAM Organization Users request has been completed with query params "sort=first_name:asc&active=false"
    Then the Element with Cypress ID "row-0" should exist
    And the Element with Cypress ID "organization-user-status" contains the text as "Inactive"

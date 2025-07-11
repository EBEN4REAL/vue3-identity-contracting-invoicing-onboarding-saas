Feature: Access Management - Groups

  Scenario: Unauthorized

    Given no User is Signed In
    And the IAM OAuth Authorize redirects to the Login page
    When the User navigates to "/sc/groups"
    Then the User should be redirected to "/login"

  Scenario: Onboarding Uncompleted

    Given the User "001" is Signed In
    And the Onboarding Flow request has been intercepted to return the Flow "user_details_without_job_role"
    When the User navigates to "/sc/groups"
    Then the User should be redirected to "/onboarding"

  Scenario: Forbidden with non-Org User

    Given the User "001OnboardingCompleted" is Signed In
    When the User navigates to "/sc/groups"
    Then the Element with Cypress ID "organization-groups-table" should NOT exist
    Then the Element with selector "#title" should have the text as "404"

  Scenario: Success with Organization Admin from direct URL

    Given the User "003" is Signed In
    And the IAM Organization Groups request has been intercepted to return the Groups "001" from Organization "001"
    When the User navigates to "/sc/groups"
    Then the Element with Cypress ID "organization-groups-table" should be visible
    And the Element with selector "#app-navigation-access-groups" should be visible

  Scenario: Success with Organization Editor from direct URL

    Given the User "004" is Signed In
    And the IAM Organization Groups request has been intercepted to return the Groups "001" from Organization "001"
    When the User navigates to "/sc/groups"
    Then the Element with Cypress ID "organization-groups-table" should be visible
    And the Element with selector "#app-navigation-access-groups" should be visible

  Scenario: Success with Organization Viewer from App Navigation

    Given the User "005" is Signed In
    And the IAM Organization Groups request has been intercepted to return the Groups "001" from Organization "001"
    And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    When the User clicks on the Element with selector "#app-navigation-access-groups"
    Then the User should be redirected to "/sc/groups"
    And the Element with Cypress ID "organization-groups-table" should be visible

  Scenario: Success with Organization Viewer from direct URL

    Given the User "005" is Signed In
    And the IAM Organization Groups request has been intercepted to return the Groups "001" from Organization "001"
    When the User navigates to "/sc/groups"
    Then the Element with Cypress ID "organization-groups-table" should be visible
    And the Element with selector "#app-navigation-access-groups" should be visible

  Scenario: Successfully redirect to detailed view
    Given the User "005" is Signed In
    And the IAM Organization Groups request has been intercepted to return the Groups "001" from Organization "001"
    And the User navigates to "/sc/groups"
    Then the Element with Cypress ID "row-0 name" should exist
    Then the User clicks on the Element with Cypress ID "row-0 name link"
    Then the User should be redirected to '/sc/groups/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1'

  Scenario: Should sort correctly by group name
    Given the User "005" is Signed In
    And the IAM Organization Groups request has been intercepted to return the Groups "asc,002" from Organization "001"
    When the User navigates to "/sc/groups"
    Then the Element with Cypress ID "sort-icon-name" should have a class "mm-table-header-cell--icon-focused"
    Then the Element with Cypress ID "organization-groups-table" should be visible
    And the IAM Organization Groups request has been intercepted to return the Groups "002,asc" from Organization "001"
    Then the User clicks on the Element with Cypress ID "sort-icon-name"
    Then the Element with Cypress ID "sort-icon-name" should NOT have a class "mm-table-header-cell--icon-focused"
    And the Element with Cypress ID "row-0 name" should have the text as "Group 2"

  

Feature: Organization - Event Log

  Scenario: Forbidden with non-Org User

    Given the User "001OnboardingCompleted" is Signed In
    When the User navigates to "/sc/logs"
    Then the Element with Cypress ID "organization-events-log-table" should NOT exist

  Scenario: Navigation Drawer with SP Admin

    Given the User "003" is Signed In
    And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    Then the Element with Cypress ID "navigation-drawer-organization-logs" should be visible

  Scenario: Success with Organization Admin

    Given the User "003" is Signed In
    And the Events request has been intercepted to return the Events "001" for Organization "001"
    When the User navigates to "/sc/logs"
    And the Element with Cypress ID "tab-item" should be visible
    And the Element with Cypress ID "organization-events-log-table" should be visible
    Then the Element with Cypress ID "navigation-drawer-organization-logs" should be visible

  Scenario: Success with Organization Editor

    Given the User "004" is Signed In
    And the Events request has been intercepted to return the Events "001" for Organization "001"
    When the User navigates to "/sc/logs"
    Then the Element with Cypress ID "tab-item" should be visible
    And the Element with Cypress ID "organization-events-log-table" should be visible
    And the Element with Cypress ID "input" should be visible
    And the Element with Cypress ID "header-title" should have the text as " Logs "
    And the Element with Cypress ID "navigation-drawer-organization-logs" should be visible

  Scenario: Success with Organization Viewer

    Given the User "005" is Signed In
    And the Events request has been intercepted to return the Events "001" for Organization "001"
    When the User navigates to "/sc/logs"
    And the Element with Cypress ID "tab-item" should be visible
    And the Element with Cypress ID "organization-events-log-table" should be visible
    And the Element with Cypress ID "input" should be visible
    And the Element with Cypress ID "header-title" should have the text as " Logs "
    Then the Element with Cypress ID "navigation-drawer-organization-logs" should be visible

  Scenario: Should be in the Event Log tab and display the event log table successfully

    Given the User "003" is Signed In
    And the Events request has been intercepted to return the Events "001" for Organization "001"
    When the User navigates to "/sc/logs"
    Then the Element with Cypress ID "header-title" contains the text as "Logs"
    And the Element with Cypress ID "tab-item-event-log" contains the text as "Event Log"
    And the Element with Cypress ID "event-log-sub-header" contains the text as "Events represent important actions made by your users on Veriam."


  Scenario: Should be able to Filter Organization in the search box in the event log table successfully

    Given the User "003" is Signed In
    And the User navigates to "/sc/logs"
    And the Events request has been intercepted to return the Events "001" for Organization "001"
    And the Element with Cypress ID "loading-row-0" should exist
    And the User waits for the event log to be populated
    And the Element with Cypress ID "loading-row-0" should NOT exist
    Then the Element with Cypress ID "row-0 payload" should exist

  Scenario: Should display date in the correct format in event log

    Given the User "003" is Signed In
    And the User navigates to "/sc/logs"
    And the Events request has been intercepted to return the Events "001" for Organization "001"
    And the Element with Cypress ID "loading-row-0" should exist
    When the User waits for the event log to be populated
    Then the Element with Cypress ID "loading-row-0" should NOT exist
    And the Element with Cypress ID "formatted-date" contains the text as "15 Jul 2024"

  Scenario: Should be able to sort event log table by type successfully

    Given the User "003" is Signed In
    And the User navigates to "/sc/logs"
    And the Events request has been intercepted to return the Events "001,002" for Organization "001" with query params "limit=10&offset=0"
    And the Element with Cypress ID "loading-row-0" should exist
    And the User waits for the event log to be populated with query params "limit=10&offset=0"
    And the Element with Cypress ID "loading-row-0" should NOT exist
    And the Events request has been intercepted to return the Events "002,001" for Organization "001" with query params "limit=10&offset=0&sort=type:desc"
    When the User clicks on the Element with Cypress ID "sort-icon-type"
    Then the Element with Cypress ID "sort-icon-type" should NOT have a class "mm-table-header-cell--icon-focused"
    And the User waits for the event log to be populated with query params "limit=10&offset=0&sort=type:desc"
    Then the Element with Cypress ID "row-0 type" should have the text as "LOGOUT"

 Scenario: Should be able to sort event log table by type first and then by timestamp successfully

  Given the User "003" is Signed In
  And the User navigates to "/sc/logs"
  And the Events request has been intercepted to return the Events "001,002" for Organization "001" with query params "limit=10&offset=0"
  And the Element with Cypress ID "loading-row-0" should exist
  And the User waits for the event log to be populated with query params "limit=10&offset=0"
  And the Element with Cypress ID "loading-row-0" should NOT exist
  And the Events request has been intercepted to return the Events "002,001" for Organization "001" with query params "limit=10&offset=0&sort=type:desc"
  When the User clicks on the Element with Cypress ID "sort-icon-type"
  And the User waits for the event log to be populated with query params "limit=10&offset=0&sort=type:desc"
  And the Events request has been intercepted to return the Events "002,001" for Organization "001" with query params "limit=10&offset=0&sort=timestamp:asc"
  And the User clicks on the Element with Cypress ID "sort-icon-timestamp"
  And the User waits for the event log to be populated with query params "limit=10&offset=0&sort=timestamp:asc"
  Then the Element with Cypress ID "row-0 type" should have the text as "LOGOUT"

Scenario: Should show payload pre code modal when user clicks on the eye icon
  Given the User "003" is Signed In
  And the User navigates to "/sc/logs"
  And the Events request has been intercepted to return the Events "001,002" for Organization "001" with query params "limit=10&offset=0&sort=timestamp:desc"
  And the Element with Cypress ID "loading-row-0" should exist
  And the User waits for the event log to be populated with query params "limit=10&offset=0&sort=timestamp:desc"
  And the Element with Cypress ID "loading-row-0" should NOT exist
  When the User clicks on the Element with Cypress ID "event-log-table-eye-btn-4ee1382c-9fd8-42ab-9847-92b34ec33fa8"
  Then the Element with Cypress ID "events-payload-dialog" should be visible

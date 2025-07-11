Feature: Organization - Organization - Logs - Audit Event Log Tab

  Scenario: Forbidden with non-Org User

    Given the User "001OnboardingCompleted" is Signed In
    When the User navigates to "/sc/logs"
    Then the Element with Cypress ID "organization-audits-events-table" should NOT exist
    And the Element with Cypress ID "page-not-found-title" should have the text as "404"
    
  Scenario: Navigation Drawer with SP Admin

    Given the User "003" is Signed In
    And the User navigates to "/"
    Then the Element with Cypress ID "navigation-drawer-organization-logs" should be visible

 Scenario: Success with Organization Admin

    Given the User "003" is Signed In
    And the IAM Audit Events request has been intercepted to return the Audit Events "001"
    And the User navigates to "/sc/logs"
    And the Element with Cypress ID "navigation-drawer-organization-logs" should be visible
    And the Events request has been intercepted to return the Events "001" for Organization "001"
    And the User clicks on the Element with Cypress ID "tab-item-audit-log"
    And the User waits for the audit events log to be populated
    Then the Element with Cypress ID "organization-audits-events-table" should be visible

  Scenario: Success with Organization Editor

    Given the User "004" is Signed In
    And the Events request has been intercepted to return the Events "001" for Organization "001"
    When the User navigates to "/sc/logs"
    And the Element with Cypress ID "navigation-drawer-organization-logs" should be visible
    And the User clicks on the Element with Cypress ID "tab-item-audit-log"
    Then the Element with Cypress ID "organization-audits-events-table" should be visible

    
  Scenario:Success with Organization Viewer

    Given the User "005" is Signed In
    And the Events request has been intercepted to return the Events "001" for Organization "001"
    When the User navigates to "/sc/logs"
    And the Element with Cypress ID "navigation-drawer-organization-logs" should be visible
    And the User clicks on the Element with Cypress ID "tab-item-audit-log"
    Then the Element with Cypress ID "organization-audits-events-table" should be visible
  
  Scenario: Success with rendering audit events 

    Given the User "003" is Signed In
    And the IAM Audit Events request has been intercepted to return the Audit Events "001"
    And the User navigates to "/sc/logs"
    And the Element with Cypress ID "navigation-drawer-organization-logs" should be visible
    And the Events request has been intercepted to return the Events "001" for Organization "001"
    And the User clicks on the Element with Cypress ID "tab-item-audit-log"
    And the User waits for the audit events log to be populated
    And the Element with Cypress ID "organization-audits-events-table" should be visible
    And the Element with Cypress ID "loading-row-0" should NOT exist
    And the Element with Cypress ID "row-0" should exist
    And the Element with Cypress ID "formatted-date" contains the text as "9 Jul 2024"
    When the User clicks on the Element with Cypress ID "event-log-table-eye-btn-ae5769f8-07ae-463e-ab39-d50b7ac251fe"
    Then the Element with Cypress ID "events-payload-dialog" should be visible

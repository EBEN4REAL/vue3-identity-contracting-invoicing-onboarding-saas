Feature: Organization - Logs - Access Logs Tab

  Scenario: Success with Organization Admin

    Given the User "003" is Signed In
    And the User navigates to "/sc/logs"
    When the User clicks on the Element with Cypress ID "tab-item-access-log"

  Scenario: Success with Organization Editor

    Given the User "004" is Signed In
    And the User navigates to "/sc/logs"
    And the IAM Access Evaluations request has been intercepted to return Access Logs "001" for Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    When the User clicks on the Element with Cypress ID "tab-item-access-log"
    Then the Element with Cypress ID "table-access-logs" should be visible

  Scenario: Success with Organization Viewer

    Given the User "005" is Signed In
    And the User navigates to "/sc/logs"
    And the IAM Access Evaluations request has been intercepted to return Access Logs "001" for Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    When the User clicks on the Element with Cypress ID "tab-item-access-log"
    Then the Element with Cypress ID "table-access-logs" should be visible

  Scenario: Correct data is displayed in table

    Given the User "005" is Signed In
    And the User navigates to "/sc/logs"
    And the IAM Access Evaluations request has been intercepted to return Access Logs "001" for Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User clicks on the Element with Cypress ID "tab-item-access-log"
    When access log request has been intercepted
    Then the Element with Cypress ID "table-access-logs row-0 evaluation_date" contains the text as "2 Aug 2024, 12:39"
    And the Element with Cypress ID "table-access-logs row-0 user" contains the text as "FirstNameCOM LastNameCOM"
    And the Element with Cypress ID "table-access-logs row-0 service_provider" contains the text as "Acme Inc. 123"
    And the Element with Cypress ID "table-access-logs row-0 oauth_client" contains the text as "Acme Inc. SP App"
    And the Element with Cypress ID "table-access-logs row-0 outcome" contains the text as "Deny"

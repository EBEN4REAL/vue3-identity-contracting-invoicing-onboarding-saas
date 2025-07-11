Feature: Organization - Logs - Access Log Details

  Scenario: Success with Organization Admin

    Given the User "003" is Signed In
    And the IAM Access Evaluations request has been intercepted to return Access Log Details "001" for Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    When the User navigates to "/sc/logs/e524b17c-2e34-4dcf-94cf-c201a4bd8945"
    Then the Element with Cypress ID "table-access-logs-details" should be visible

  Scenario: Success with Organization Editor

    Given the User "004" is Signed In
    And the IAM Access Evaluations request has been intercepted to return Access Log Details "001" for Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    When the User navigates to "/sc/logs/e524b17c-2e34-4dcf-94cf-c201a4bd8945"
    Then the Element with Cypress ID "table-access-logs-details" should be visible

  Scenario: Success with Organization Viewer

    Given the User "005" is Signed In
    And the IAM Access Evaluations request has been intercepted to return Access Log Details "001" for Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    When the User navigates to "/sc/logs/e524b17c-2e34-4dcf-94cf-c201a4bd8945"
    Then the Element with Cypress ID "table-access-logs-details" should be visible

  Scenario: Success from Access Logs page
    Given the User "005" is Signed In
    And the User navigates to "/sc/logs"
    And the IAM Access Evaluations request has been intercepted to return Access Logs "001" for Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User clicks on the Element with Cypress ID "tab-item-access-log"
    And access log request has been intercepted
    When the User clicks on the Element with Cypress ID "table-access-logs row-0 actions"
    When the User clicks on the Element with Cypress ID "actions-dropdown-e524b17c-2e34-4dcf-94cf-c201a4bd8945-item-view-access-log"
    Then the Element with Cypress ID "table-access-logs-details" should be visible

  Scenario: Correct data is displayed in details

    Given the User "005" is Signed In
    And the IAM Access Evaluations request has been intercepted to return Access Log Details "001" for Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User navigates to "/sc/logs/e524b17c-2e34-4dcf-94cf-c201a4bd8945"
    When access log details request has been intercepted
    Then the Element with Cypress ID "detail-value-Application" contains the text as "Acme Inc. SP App"
    And the Element with Cypress ID "detail-value-Resource" contains the text as "-"
    And the Element with Cypress ID "detail-value-User" contains the text as "user@metricsmatter.com"
    And the Element with Cypress ID "detail-value-Date/Time" contains the text as "2 Aug 2024, 12:39"
    And the Element with Cypress ID "detail-value-Result" contains the text as "Allow"

  Scenario: Correct data is displayed in table

    Given the User "005" is Signed In
    And the IAM Access Evaluations request has been intercepted to return Access Log Details "001" for Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the User navigates to "/sc/logs/e524b17c-2e34-4dcf-94cf-c201a4bd8945"
    When access log details request has been intercepted
    Then the Element with Cypress ID "table-access-logs-details row-0 policy" contains the text as "Policy #1"
    And the Element with Cypress ID "table-access-logs-details row-0 agreement" contains the text as "-"
    And the Element with Cypress ID "table-access-logs-details row-0 outcome" contains the text as "Allow"

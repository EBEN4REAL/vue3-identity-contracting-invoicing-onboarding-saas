Feature: Admin - Access Log Details

  Scenario: Success from Admin Access Logs page
    Given the User "MMAdmin001" is Signed In
    And the IAM Access Evaluations request has been intercepted to return Access Logs "001"
    And the User navigates to "/sc/admin/access-logs"

  Scenario: Correct data is displayed in details

    Given the User "MMAdmin001" is Signed In
    And the IAM Access Evaluations request has been intercepted to return Access Log Details "001"
    And the User navigates to "/sc/admin/access-logs/e524b17c-2e34-4dcf-94cf-c201a4bd8945"
    When access log details request has been intercepted
    Then the Element with Cypress ID "detail-value-Application" contains the text as "Acme Inc. SP App"
    And the Element with Cypress ID "detail-value-Organization" contains the text as "Acme Inc."
    And the Element with Cypress ID "detail-value-Resource" contains the text as "-"
    And the Element with Cypress ID "detail-value-User" contains the text as "user@metricsmatter.com"
    And the Element with Cypress ID "detail-value-Date/Time" contains the text as "2 Aug 2024, 12:39"
    And the Element with Cypress ID "detail-value-Result" contains the text as "Allow"

  Scenario: Correct data is displayed in table

    Given the User "MMAdmin001" is Signed In
    And the IAM Access Evaluations request has been intercepted to return Access Log Details "001"
    And the User navigates to "/sc/admin/access-logs/e524b17c-2e34-4dcf-94cf-c201a4bd8945"
    When access log details request has been intercepted
    Then the Element with Cypress ID "table-access-logs-details row-0 policy" contains the text as "Policy #1"
    And the Element with Cypress ID "table-access-logs-details row-0 agreement" contains the text as "-"
    And the Element with Cypress ID "table-access-logs-details row-0 outcome" contains the text as "Allow"

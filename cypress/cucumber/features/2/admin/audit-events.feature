Feature: Admin - Audit Events

  Scenario: Forbidden

    Given the User "002" is Signed In
    When the User navigates to "/sc/admin/audit-events"
    Then the Element with selector "#audit-events" should NOT exist
    Then the Element with selector "#title" should have the text as "404"

  Scenario: Success

    Given the User "MMAdmin001" is Signed In
    And the IAM Audit Events request has been intercepted to return the Audit Events "001"
    When the User navigates to "/sc/admin/audit-events"
    Then the Element with selector "#audit-events" should be visible

Feature: Admin - Events

  Scenario: Forbidden

    Given the User "002" is Signed In
    When the User navigates to "/sc/admin/events"
    Then the Element with selector "#events" should NOT exist
    Then the Element with selector "#title" should have the text as "404"

  Scenario: Success

    Given the User "MMAdmin001" is Signed In
    And the Event Types request has been intercepted to return the Event Types "LOGIN,LOGIN_FAILED,LOGOUT"
    And the IAM Service Providers request has been intercepted to return the Service Providers "001"
    And the IAM Organizations request has been intercepted to return the Organizations "001"
    And the Events request has been intercepted to return the Events "001"
    When the User navigates to "/sc/admin/events"
    Then the Element with selector "#events" should be visible

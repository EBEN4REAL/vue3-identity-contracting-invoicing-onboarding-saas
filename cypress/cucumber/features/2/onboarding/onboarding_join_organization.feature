Feature: Onboarding - Request to Join Organization

  Scenario: Subtitle contains correct text before User requested to join organization
    Given the User "001" is Signed In
    And the IAM OAuth Create Token has been intercepted to return the Onboarding Token for User "001"
    And the Onboarding Flow request has been intercepted to return the Flow "request_to_join_organization"
    And the Onboarding check current User in the Organization "001-short" request has been intercepted to return error 404
    And the Onboarding check current User in the Organization "002-short" request has been intercepted to return error 404
    And the Onboarding check current User in the Organization "003-short" request has been intercepted to return error 404
    When the User navigates to "/onboarding"
    Then the Element with Cypress ID "join-subtitle" contains the text as "We have found the following organisations, please select the organization you would like to join"

  Scenario: Multiple organizations should be presented in list
    Given the User "001" is Signed In
    And the IAM OAuth Create Token has been intercepted to return the Onboarding Token for User "001"
    And the Onboarding Flow request has been intercepted to return the Flow "request_to_join_organization"
    And the Onboarding check current User in the Organization "001-short" request has been intercepted to return error 404
    And the Onboarding check current User in the Organization "002-short" request has been intercepted to return error 404
    And the Onboarding check current User in the Organization "003-short" request has been intercepted to return error 404
    When the User navigates to "/onboarding"
    Then the Element with Cypress ID "organization-1ac3ce81-6132-4145-851d-10450644ce46" should exist
    And the Element with Cypress ID "organization-1ac3ce81-6132-4145-851d-10450644ce45" should exist
    And the Element with Cypress ID "organization-1ac3ce81-6132-4145-851d-10450644ce44" should exist

  Scenario: Organization should have correct name in list
    Given the User "001" is Signed In
    And the IAM OAuth Create Token has been intercepted to return the Onboarding Token for User "001"
    And the Onboarding Flow request has been intercepted to return the Flow "request_to_join_organization"
    When the User navigates to "/onboarding"
    Then the Element with Cypress ID "organization-1ac3ce81-6132-4145-851d-10450644ce46 organization-name" contains the text as "Org 001"

  Scenario: Button Previous step should exist before User requested to join organization
    Given the User "001" is Signed In
    And the IAM OAuth Create Token has been intercepted to return the Onboarding Token for User "001"
    And the Onboarding Flow request has been intercepted to return the Flow "request_to_join_organization"
    When the User navigates to "/onboarding"
    Then the Element with Cypress ID "button-previous" should exist

  Scenario: User should see success subtitle after requesting to join the organization
    Given the User "001" is Signed In
    And the IAM OAuth Create Token has been intercepted to return the Onboarding Token for User "001"
    And the Onboarding Flow request has been intercepted to return the Flow "request_to_join_organization"
    And the User navigates to "/onboarding"
    And the IAM Organization "001-short" Join Request for User "001" has been intercepted to return the Request Status pending
    When the User clicks on the Element with Cypress ID "organization-1ac3ce81-6132-4145-851d-10450644ce46 button-join-organization"
    Then the Element with Cypress ID "join-subtitle" contains the text as "Request has been sent to Org 001"

  Scenario: User should see success subtitle in main message after requesting to join the organization
    Given the User "001" is Signed In
    And the IAM OAuth Create Token has been intercepted to return the Onboarding Token for User "001"
    And the Onboarding Flow request has been intercepted to return the Flow "request_to_join_organization"
    And the User navigates to "/onboarding"
    And the IAM Organization "001-short" Join Request for User "001" has been intercepted to return the Request Status pending
    When the User clicks on the Element with Cypress ID "organization-1ac3ce81-6132-4145-851d-10450644ce46 button-join-organization"
    Then the Element with Cypress ID "success-subtitle" contains the text as "Your request to join Org 001 has been sent. You will receive an email when it has been actioned."

  Scenario: User should not see button Previous step after requesting to join the organization
    Given the User "001" is Signed In
    And the IAM OAuth Create Token has been intercepted to return the Onboarding Token for User "001"
    And the Onboarding Flow request has been intercepted to return the Flow "request_to_join_organization"
    And the User navigates to "/onboarding"
    And the IAM Organization "001-short" Join Request for User "001" has been intercepted to return the Request Status pending
    When the User clicks on the Element with Cypress ID "organization-1ac3ce81-6132-4145-851d-10450644ce46 button-join-organization"
    Then the Element with Cypress ID "button-previous" should NOT exist

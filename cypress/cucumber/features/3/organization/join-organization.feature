Feature: Admin - Request to Join Organization

  Scenario: Success - Join Request Accepted

    Given the User "003" is Signed In
    And the IAM Organization User request has been intercepted to return the Organization User "001" from Organization "001"
    And the IAM User request has been intercepted to return the User "005"
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return no units for Organization "001"
    And the IAM Organization groups request has been intercepted to return no groups for Organization "001"
    And the IAM Organization update Organization User with ID "001" for Organization "001" request has been intercepted
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization Groups request has been intercepted to return the Groups "001" from Organization "001"
    And the IAM Organization create Unit Users for Organization "001" request has been intercepted
    And the IAM Organization create Group Users for Organization "001" request has been intercepted
    And the User navigates to "sc/4a6f01d0-f3c6-4923-ad98-112d6d97355b/pending_requests/2e80ddf8-3563-467d-9413-f336640ff591"
    When the User selects "Yes" in the DropDown Element with ID "add-user"
    And the User selects "Unit 1" in the DropDown Element with ID "organization-units-select"
    And the User selects "Group 1" in the DropDown Element with ID "organization-groups-select"
    And the User clicks on the Element with selector "#submit-button"
    Then the Element with Cypress ID "mm-toast" should exist
    And the Element with Cypress ID "mm-toast" contains the text as "Request has been processed"

  Scenario: Success - Join Request Rejected
    Given the User "003" is Signed In
    And the IAM Organization User request has been intercepted to return the Organization User "001" from Organization "001"
    And the IAM User request has been intercepted to return the User "005"
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return no units for Organization "001"
    And the IAM Organization groups request has been intercepted to return no groups for Organization "001"
    And the IAM Organization update Organization User with ID "001" for Organization "001" request has been intercepted
    And the User navigates to "sc/4a6f01d0-f3c6-4923-ad98-112d6d97355b/pending_requests/2e80ddf8-3563-467d-9413-f336640ff591"
    When the User selects "No" in the DropDown Element with ID "add-user"
    And the User clicks on the Element with selector "#submit-button"
    Then the Element with Cypress ID "mm-toast" should exist
    And the Element with Cypress ID "mm-toast" contains the text as "Request has been processed"

  Scenario: Join Request for Organization With No Units Or Groups
    Given the User "003" is Signed In
    And the IAM Organization User request has been intercepted to return the Organization User "001" from Organization "001"
    And the IAM User request has been intercepted to return the User "005"
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return no units for Organization "001"
    And the IAM Organization groups request has been intercepted to return no groups for Organization "001"
    When the User navigates to "sc/4a6f01d0-f3c6-4923-ad98-112d6d97355b/pending_requests/2e80ddf8-3563-467d-9413-f336640ff591"
    Then the Element with selector "#request-title" should have the text as "User User005@email.com has requested to join your organization"
    And the Element with selector "#request-message" should have the text as " Add User005@email.com to Org 001? "
    And the Element with selector "#organization-units" should NOT exist
    And the Element with selector "#organization-groups" should NOT exist
    And the Element with selector "#submit-button" should be visible

  Scenario: Join Request for Organization With Units And No Groups
    Given the User "003" is Signed In
    And the IAM Organization User request has been intercepted to return the Organization User "001" from Organization "001"
    And the IAM User request has been intercepted to return the User "005"
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization groups request has been intercepted to return no groups for Organization "001"
    When the User navigates to "sc/4a6f01d0-f3c6-4923-ad98-112d6d97355b/pending_requests/2e80ddf8-3563-467d-9413-f336640ff591"
    Then the Element with selector "#request-title" should have the text as "User User005@email.com has requested to join your organization"
    And the Element with selector "#request-message" should have the text as " Add User005@email.com to Org 001? "
    And the Element with selector "#organization-units" should be visible
    And the Element with selector "#organization-groups" should NOT exist
    And the Element with selector "#submit-button" should be visible

  Scenario: Join Request for Organization With Groups And No Units
    Given the User "003" is Signed In
    And the IAM Organization User request has been intercepted to return the Organization User "001" from Organization "001"
    And the IAM User request has been intercepted to return the User "005"
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return no units for Organization "001"
    And the IAM Organization Groups request has been intercepted to return the Groups "001" from Organization "001"
    When the User navigates to "sc/4a6f01d0-f3c6-4923-ad98-112d6d97355b/pending_requests/2e80ddf8-3563-467d-9413-f336640ff591"
    Then the Element with selector "#request-title" should have the text as "User User005@email.com has requested to join your organization"
    And the Element with selector "#request-message" should have the text as " Add User005@email.com to Org 001? "
    And the Element with selector "#organization-groups" should be visible
    And the Element with selector "#organization-units" should NOT exist
    And the Element with selector "#submit-button" should be visible

  Scenario: Join Request for Organization With Groups And Units
    Given the User "003" is Signed In
    And the IAM Organization User request has been intercepted to return the Organization User "001" from Organization "001"
    And the IAM User request has been intercepted to return the User "005"
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM Organization units request has been intercepted to return the units of Organization "001"
    And the IAM Organization Groups request has been intercepted to return the Groups "001" from Organization "001"
    When the User navigates to "sc/4a6f01d0-f3c6-4923-ad98-112d6d97355b/pending_requests/2e80ddf8-3563-467d-9413-f336640ff591"
    Then the Element with selector "#request-title" should have the text as "User User005@email.com has requested to join your organization"
    And the Element with selector "#request-message" should have the text as " Add User005@email.com to Org 001? "
    And the Element with selector "#organization-groups" should be visible
    And the Element with selector "#organization-units" should be visible
    And the Element with selector "#submit-button" should be visible

  Scenario: User already accepted
    Given the User "003" is Signed In
    And the IAM Organization User request has been intercepted to return the Organization User "002" from Organization "001"
    And the IAM User request has been intercepted to return the User "006"
    And the IAM Organization request has been intercepted to return the Organization "001"
    When the User navigates to "sc/4a6f01d0-f3c6-4923-ad98-112d6d97355b/pending_requests/9f8c5b13-e6a2-4d87-ae3f-71b4d2f8c492"
    And the Element with selector "#request-status-message" should have the text as " This request has already been accepted"

  Scenario: User already rejected
    Given the User "003" is Signed In
    And the IAM Organization User request has been intercepted to return the Organization User "003" from Organization "001"
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the IAM User request has been intercepted to return the User "003"
    When the User navigates to "sc/4a6f01d0-f3c6-4923-ad98-112d6d97355b/pending_requests/ded35af8-c60c-4f98-b35b-64db59deb4a7"
    And the Element with selector "#request-status-message" should have the text as " This request has already been rejected"

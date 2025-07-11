Feature: Delete - Organization Group

  Scenario: Delete Button disabled for Organization Viewer

    Given the User "005" is Signed In
    And the IAM Organization Groups request has been intercepted to return the Groups "001" from Organization "001"
    When the User navigates to "/sc/groups"
    Then the Element with Cypress ID "actions-dropdown-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1-item-delete" should have a class "mm-dropdown-item--disabled"

  Scenario: Show confirm modal after clicking on delete button

    Given the User "MMAdmin001" is Signed In
    And the IAM Organization Groups request has been intercepted to return the Groups "001" from Organization "001"
    And the User navigates to "/sc/groups"
    And the User clicks on the Element with Cypress ID "actions-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    When the User clicks on the Element with Cypress ID "actions-dropdown-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1-item-delete"
    Then the Element with Cypress ID "confirm-delete-group" should be visible
    And the Element with Cypress ID "confirm-delete-group" contains the text as "Delete Group 1?"

  Scenario: Hide confirm modal after clicking on modal's cancel button

    Given the User "MMAdmin001" is Signed In
    And the IAM Organization Groups request has been intercepted to return the Groups "001" from Organization "001"
    And the User navigates to "/sc/groups"
    And the User clicks on the Element with Cypress ID "actions-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    And the User clicks on the Element with Cypress ID "actions-dropdown-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1-item-delete"
    And the Element with Cypress ID "confirm-delete-group" should be visible
    When the User clicks on the Element with Cypress ID "button-cancel-delete-group"
    Then the Element with Cypress ID "confirm-delete-group" should NOT exist

  Scenario: Removing group from list after clicking on modal's delete button

    Given the User "MMAdmin001" is Signed In
    And the IAM Organization Groups request has been intercepted to return the Groups "001,002" from Organization "001"
    And the User navigates to "/sc/groups"
    And the User clicks on the Element with Cypress ID "actions-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    And the User clicks on the Element with Cypress ID "actions-dropdown-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1-item-delete"
    And the IAM Organization delete Group "001" for Organization "001" request has been intercepted
    And the IAM Organization Groups request has been intercepted to return the Groups "002" from Organization "001"
    When the User clicks on the Element with Cypress ID "button-confirm-delete-group"
    Then the Element with Cypress ID "organization-groups-table" DOES NOT contain the text as "Group 1"

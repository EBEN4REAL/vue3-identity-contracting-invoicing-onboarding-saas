@ignore
Feature: Organization Groups Users - Delete

  Scenario: Delete User from Organization Group
    Given the User "MMAdmin001" is Signed In
    And the IAM Organization Group by ID request has been intercepted to return the Group "001" from Organization "001"
    And the IAM Organization User request has been intercepted to return the Group Users "001" from Organization "001"
    And the User navigates to "/sc/groups/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    When the User clicks on the Element with Cypress ID "tab-item-users"
    When the User clicks on the Element with Cypress ID "actions-button-1edfc35c-e116-4c2e-8e35-8a28b68d5f6d"
    When the User clicks on the Element with Cypress ID "dropdown-1edfc35c-e116-4c2e-8e35-8a28b68d5f6d-item-remove-from-group"
    Then the IAM Organization ID "001" with Group ID "001" with User ID "3fa85f64-5717-4562-b3fc-2c963f66afa6" delete User from organization request has been intercepted to delete User
    And the IAM Organization User request has been intercepted to return the Group Users "002" from Organization "001"
    Then the User clicks on the Element with Cypress ID "button-confirm-delete-user"
    Then the Element with Cypress ID "actions-button-1edfc35c-e116-4c2e-8e35-8a28b68d5f6d" should NOT exist
    And the Element with Cypress ID "name" should have the text as "User 2 string"

  Scenario: Delete User from Organization Group with backend error
    Given the User "007" is Signed In
    And the IAM Organization Group by ID request has been intercepted to return the Group "001" from Organization "001"
    And the IAM Organization User request has been intercepted to return the Group Users "001" from Organization "001"
    When the User navigates to "/sc/groups/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    When the User clicks on the Element with Cypress ID "tab-item-users"
    And the IAM Organization Group request has been intercepted to return error after deleting User with ID "86678c73-b72a-4c8e-9dca-0bf5d1a1c6a2" from the Groups "RegularGroup002" from Organization "001"
    When the User clicks on the Element with Cypress ID "actions-button-1edfc35c-e116-4c2e-8e35-8a28b68d5f6d"
    When the User clicks on the Element with Cypress ID "dropdown-1edfc35c-e116-4c2e-8e35-8a28b68d5f6d-item-remove-from-group"
    And the User clicks on the Element with Cypress ID "button-confirm-delete-user"
    And the Element with Cypress ID "mm-toast" should have the text as "Error while deleting user from group"

  Scenario: Groups Table should have dropdown with option View User and Remove from Group
    Given the User "MMAdmin001" is Signed In
    And the IAM Organization Group by ID request has been intercepted to return the Group "001" from Organization "001"
    And the IAM Organization User request has been intercepted to return the Group Users "001" from Organization "001"
    And the User navigates to "/sc/groups/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    When the User clicks on the Element with Cypress ID "tab-item-users"
    When the User clicks on the Element with Cypress ID "actions-button-1edfc35c-e116-4c2e-8e35-8a28b68d5f6d"
    Then the Element with Cypress ID "dropdown-1edfc35c-e116-4c2e-8e35-8a28b68d5f6d-item-view-user" should exist
    Then the Element with Cypress ID "dropdown-1edfc35c-e116-4c2e-8e35-8a28b68d5f6d-item-remove-from-group" should exist

  Scenario: Remove User from Group Dialog should exist and have correct title and subtitle and should be possible to close it
    Given the User "MMAdmin001" is Signed In
    And the IAM Organization Group by ID request has been intercepted to return the Group "001" from Organization "001"
    And the IAM Organization User request has been intercepted to return the Group Users "001" from Organization "001"
    And the User navigates to "/sc/groups/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    When the User clicks on the Element with Cypress ID "tab-item-users"
    When the User clicks on the Element with Cypress ID "actions-button-1edfc35c-e116-4c2e-8e35-8a28b68d5f6d"
    When the User clicks on the Element with Cypress ID "dropdown-1edfc35c-e116-4c2e-8e35-8a28b68d5f6d-item-remove-from-group"
    Then the Element with Cypress ID "confirm-delete-user" should exist
    Then the Element with Cypress ID "dialog-title" should have the text as "Remove User"
    Then the Element with Cypress ID "dialog-subtitle" should have the text as "Are you sure you want to remove string string from Group 1?"
    When the User clicks on the Element with Cypress ID "button-cancel-delete-user"
    Then the Element with Cypress ID "confirm-delete-user" should NOT exist



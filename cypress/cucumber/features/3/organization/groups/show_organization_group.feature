Feature: Show - Organization Group

  Scenario: Group title and description are displayed

    Given the User "005" is Signed In
    And the IAM User @me request has been intercepted to return the User "005"
    And the IAM Organization Group by ID request has been intercepted to return the Group "001" from Organization "001"
    When the User navigates to "/sc/groups/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    Then the Element with Cypress ID "header-title" contains the text as "Group 1"
    Then the Element with Cypress ID "header-subtitle" contains the text as "Group 1 Description"

  Scenario: Delete button enabled for group with no users

    Given the User "MMAdmin001" is Signed In
    And the IAM User @me request has been intercepted to return the User "MMAdmin001"
    And the IAM Organization Group by ID request has been intercepted to return the Group "001" from Organization "001"
    When the User navigates to "/sc/groups/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    Then the Element with Cypress ID "dropdown-item-delete-group" should NOT have a class "mm-dropdown-item--disabled"

  Scenario: Delete button disabled for non-admin user

    Given the User "005" is Signed In
    And the IAM User @me request has been intercepted to return the User "005"
    And the IAM Organization Group by ID request has been intercepted to return the Group "002-with-users" from Organization "001"
    When the User navigates to "/sc/groups/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a2"
    Then the Element with Cypress ID "dropdown-item-delete-group" should have a class "mm-dropdown-item--disabled"


  Scenario: Delete button disabled for group with users

    Given the User "MMAdmin001" is Signed In
    And the IAM User @me request has been intercepted to return the User "MMAdmin001"
    And the IAM Organization Group by ID request has been intercepted to return the Group "002-with-users" from Organization "001"
    When the User navigates to "/sc/groups/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a2"
    Then the Element with Cypress ID "dropdown-item-delete-group" should have a class "mm-dropdown-item--disabled"

  Scenario: Successfully redirect to Users detailed view from group details
    Given the User "MMAdmin001" is Signed In
    And the IAM User @me request has been intercepted to return the User "MMAdmin001"
    And the IAM Organization Group by ID request has been intercepted to return the Group "001" from Organization "001"
    And the IAM Organization User request has been intercepted to return the Group Users "001" from Organization "001"
    And the User navigates to "/sc/groups/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    And the User clicks on the Element with Cypress ID "tab-item-users"
    Then the User clicks on the Element with Cypress ID "row-0 name table-1edfc35c-e116-4c2e-8e35-8a28b68d5f6d"
    Then the User should be redirected to '/sc/users/1edfc35c-e116-4c2e-8e35-8a28b68d5f6d'

  Scenario: Successfully redirect to Licenses detailed view from group details
    Given the User "005" is Signed In
    And the IAM User @me request has been intercepted to return the User "005"
    And the IAM Organization Group by ID request has been intercepted to return the Group "001" from Organization "001"
    And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Policies Service Consumers Agreements request has been intercepted to return the Licenses "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b" and Group "86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    And the Service Consumers Policies request has been intercepted to return the PolicyType "001" from Organization "4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the IAM Organization User request has been intercepted to return the Group Users "001" from Organization "001"
    And the User navigates to "/sc/groups/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    And the User clicks on the Element with Cypress ID "tab-item-access"
    Then the User clicks on the Element with Cypress ID "licenses-table license-86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    Then the User should be redirected to '/sc/access-licenses/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1'


Feature: Organization Groups Users - Add

  Scenario: Button for adding users to group should exist
    Given the User "MMAdmin001" is Signed In
    And the IAM Organization Group by ID request has been intercepted to return the Group "001" from Organization "001"
    And the IAM Organization User request has been intercepted to return the Group Users "001" from Organization "001"
    And the User navigates to "/sc/groups/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    When the User clicks on the Element with Cypress ID "tab-item-users"
    Then the Element with Cypress ID "add-user-button" should exist

  Scenario: Dialog for adding users to group should exist
    Given the User "MMAdmin001" is Signed In
    And the IAM Organization Group by ID request has been intercepted to return the Group "001" from Organization "001"
    And the IAM Organization User request has been intercepted to return the Group Users "001" from Organization "001"
    And the User navigates to "/sc/groups/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    And the User clicks on the Element with Cypress ID "tab-item-users"
    When the User clicks on the Element with Cypress ID "add-user-button"
    Then the Element with Cypress ID "add-user-dialog" should exist

  Scenario: Group users should be marked as added and remove icon should not exist and Invite hint should exist and should open the Invite modal when clicked
    Given the User "005" is Signed In
    And the IAM Organization Group by ID request has been intercepted to return the Group "003" from Organization "001"
    And the IAM Organization User request has been intercepted to return the Group Users "003" from Organization "001"
    And the IAM Organization Users request has been intercepted to return Users "001,002,022" from Organization "001"
    And the User navigates to "/sc/groups/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    And the User clicks on the Element with Cypress ID "tab-item-users"
    And the User clicks on the Element with Cypress ID "add-user-button"
    When the User clicks on the Element with Cypress ID "user-ids-autocomplete autocomplete"
    Then the Element with Cypress ID "badge-added" should exist
    And the Element with Cypress ID "button-remove-user" should NOT exist
    And the Element with Cypress ID "autocomplete-options-hint" should exist
    And the User clicks on the Element with Cypress ID "button-open-dialog-invite-users"
    And the Element with Cypress ID "dialog-invite-organization-users" should exist


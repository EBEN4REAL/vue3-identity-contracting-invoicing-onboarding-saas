Feature: Edit - Organization Group

  Scenario: Successfully display correct data and disable edit button for default Organization Group Admins
    Given the User "MMAdmin001" is Signed In
    And the IAM Organization Group by ID request has been intercepted to return the Group "001-default-group" from Organization "001"
    When the User navigates to "/sc/groups/13766321-15f8-4264-8435-70fcc3fba6bc"
    Then the Element with Cypress ID "group-name" contains the text as "Admins"
    And the Element with Cypress ID "description" contains the text as "Organization Admins"
    And the Element with Cypress ID "button-edit-organization-group" should have the attribute "disabled" as "disabled" 
    And the user force hovers over the element with the Cypress ID "button-edit-organization-group"
    And the Element with Cypress ID "tooltip" contains the text as "You can't edit this group"

  Scenario: Filling in the Form
    Given the User "MMAdmin001" is Signed In
    And the IAM Organization Group by ID request has been intercepted to return the Group "001" from Organization "001"
    And the User navigates to "/sc/groups/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    When the User clicks on the Element with Cypress ID "button-edit-organization-group"
    Then the Input inside Element with Cypress ID "input-group-name" should have the value as "Group 1"
    And the Textarea inside Element with Cypress ID "input-group-description" should have the value as "Group 1 Description"

  Scenario: Validation Error
    Given the User "MMAdmin001" is Signed In
    And the IAM Organization Group by ID request has been intercepted to return the Group "001" from Organization "001"
    And the User navigates to "/sc/groups/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    And the User clicks on the Element with Cypress ID "button-edit-organization-group"
    And the User clears the Input inside Element with Cypress ID "input-group-name"
    When the User clicks on the Element with Cypress ID "button-save-changes"
    Then the Element with Cypress ID "input-group-name" should have a class "mm-input-error"

  Scenario: Updated
    Given the User "MMAdmin001" is Signed In
    And the IAM Organization Group by ID request has been intercepted to return the Group "001" from Organization "001"
    And the User navigates to "/sc/groups/86678c73-b72a-4c8e-9dca-0bf5d1a1c6a1"
    And the User clicks on the Element with Cypress ID "button-edit-organization-group"
    And the User types "new name" in Input inside Element with Cypress ID "input-group-name"
    And the IAM Organization update Group "001" for Organization "001" request has been intercepted
    And the IAM Organization Group by ID request has been intercepted to return the Group "001" with new name "new name" from Organization "001"
    When the User clicks on the Element with Cypress ID "button-save-changes"
    Then the Element with Cypress ID "group-name" contains the text as "new name"

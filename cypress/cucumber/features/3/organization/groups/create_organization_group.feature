Feature: Create - Organization Group

  Scenario: Button not visible with Organization Viewer

    Given the User "005" is Signed In
    And the IAM Organization Groups request has been intercepted to return the Groups "001" from Organization "001"
    When the User navigates to "/sc/groups"
    Then the Element with Cypress ID "create-group-button" should NOT exist

  Scenario: Open modal on click
    Given the User "MMAdmin001" is Signed In
    And the IAM Organization Groups request has been intercepted to return the Groups "001" from Organization "001"
    When the User navigates to "/sc/groups"
    And the User clicks on the Element with Cypress ID "create-group-button"
    Then the Element with Cypress ID "create-group-dialog" should exist

  Scenario: Validation Error
    Given the User "MMAdmin001" is Signed In
    And the IAM Organization Groups request has been intercepted to return the Groups "001" from Organization "001"
    And the User navigates to "/sc/groups"
    And the User clicks on the Element with Cypress ID "create-group-button"
    When the User clicks on the Element with Cypress ID "create-group-submit-button"
    Then the Element with Cypress ID "create-group-name" should have a class "mm-input-error"

  Scenario: Duplicate Group Name
    Given the User "MMAdmin001" is Signed In
    And the IAM Organization Groups request has been intercepted to return the Groups "001" from Organization "001"
    And the User navigates to "/sc/groups"
    And the User clicks on the Element with Cypress ID "create-group-button"
    And the User types "Group 001" in the Element with Cypress ID "create-group-name"
    And the User types "Group 001 description" in the Textarea with Cypress ID "create-group-description"
    And the IAM Organization create Group for Organization "001" request has been intercepted with duplicate error
    When the User clicks on the Element with Cypress ID "create-group-submit-button"
    Then the Element with Cypress ID "create-group-alert" should exist


  Scenario: Created
    Given the User "MMAdmin001" is Signed In
    And the IAM Organization Groups request has been intercepted to return the Groups "001" from Organization "001"
    And the User navigates to "/sc/groups"
    And the User clicks on the Element with Cypress ID "create-group-button"
    And the User types "Group 001" in the Element with Cypress ID "create-group-name"
    And the User types "Group 001 description" in the Textarea with Cypress ID "create-group-description"
    And the IAM Organization create Group for Organization "001" request has been intercepted
    And the IAM Organization Groups request has been intercepted to return the Groups "001" from Organization "001"
    When the User clicks on the Element with Cypress ID "create-group-submit-button"
    Then the Element with Cypress ID "organization-groups-table" contains the text as "Group 1"

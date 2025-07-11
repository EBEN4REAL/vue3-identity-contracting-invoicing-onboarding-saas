Feature: Suborganizations - Create

  Scenario: Show Create Suborganization Dialog

    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Suborganizations request has been intercepted to return the Suborganizations "002" for Organization "001"
    And the User clicks on the Element with Cypress ID "tab-item-sub-organizations"
    When the User clicks on the Element with Cypress ID "button-create-sub-organization"
    Then the Element with Cypress ID "create-suborg-dialog" should be visible

  Scenario: Show Validation Errors

    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Suborganizations request has been intercepted to return the Suborganizations "002" for Organization "001"
    And the User clicks on the Element with Cypress ID "tab-item-sub-organizations"
    And the User clicks on the Element with Cypress ID "button-create-sub-organization"
    When the User clicks on the Element with Cypress ID "create-suborg-submit-button"
    Then the Element with Cypress ID "create-suborg-name" should have a class "mm-input-error"
    And the Element with Cypress ID "create-suborg-email" should have a class "mm-input-error"

  Scenario: Create Suborganization Success

    Given the User "003" is Signed In
    And the IAM Organization request has been intercepted to return the Organization "001"
    And the User navigates to "/sc/organizations/4a6f01d0-f3c6-4923-ad98-112d6d97355b"
    And the Suborganizations request has been intercepted to return the Suborganizations "002" for Organization "001"
    And the User clicks on the Element with Cypress ID "tab-item-sub-organizations"
    And the User clicks on the Element with Cypress ID "button-create-sub-organization"
    And the User enters text "Org 011" in Input inside Element with Cypress ID "create-suborg-name"
    And the User enters text "Org011@mail.com" in Input inside Element with Cypress ID "create-suborg-email"
    And the Create Suborganizations request has been intercepted to return success for Organization "001"
    And the Suborganizations request has been intercepted to return the Suborganizations "002,011" for Organization "001"
    When the User clicks on the Element with Cypress ID "create-suborg-submit-button"
    Then the Element with Cypress ID "sub-organizations-table" contains the text as "Org 011"
    And the Element with Cypress ID "sub-organizations-table" contains the text as "SaaS"

